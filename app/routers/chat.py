from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services.scoring_service import create_bundles
from app.services.interfaces import IFlightsService, IHotelsService, INLPService, ICarRentalService
from app.dependencies import get_flights_service, get_hotels_service, get_nlp_service, get_cars_service, get_visa_service
from app.services.visa_service import TravelbriefingVisaService
import asyncio

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

from sqlalchemy.orm import Session
from app.database import get_db
from app.models.db_models import TripRequestDB, RecommendationDB
from app.models.trip_request import TripExtraction

def validate_trip_data(trip: TripExtraction) -> TripExtraction:
    """
    Post-LLM validation to ensure critical fields are present.
    Only validate if there's no existing reply_message (which indicates an error).
    """
    # If there's already a reply_message (error condition), don't add missing fields
    if trip.reply_message:
        return trip

    required_fields = ["origin", "destination", "start_date", "end_date", "travelers"]
    missing = list(trip.missing_fields) if trip.missing_fields else []

    for field in required_fields:
        if getattr(trip, field) is None and field not in missing:
            missing.append(field)

    if missing:
        trip.reply_message = f"I need more information. Please provide: {', '.join(missing)}"

    trip.missing_fields = missing
    return trip

@router.post("/chat")
async def chat_endpoint(
    request: ChatRequest,
    flights_service: IFlightsService = Depends(get_flights_service),
    hotels_service: IHotelsService = Depends(get_hotels_service),
    cars_service: ICarRentalService = Depends(get_cars_service),
    nlp_service: INLPService = Depends(get_nlp_service),
    visa_service: TravelbriefingVisaService = Depends(get_visa_service),
    db: Session = Depends(get_db)
):
    # 1. Parse
    trip = await nlp_service.extract(request.message)
    
    # 2. Validate (Post-LLM check)
    trip = validate_trip_data(trip)
    
    # 3. Normalize locations to IATA codes
    from app.config.locations import normalize_to_iata
    if trip.origin:
        trip.origin = normalize_to_iata(trip.origin)
    if trip.destination:
        trip.destination = normalize_to_iata(trip.destination)
    
    # 4. Check missing
    if trip.missing_fields:
        message = trip.reply_message or f"I need more information. Please provide: {', '.join(trip.missing_fields)}"
        return {
            "message": message,
            "missing_fields": trip.missing_fields,
            "extracted_data": trip.model_dump()
        }
        
    # 4. Search (Concurrent)
    flights_task = flights_service.search_flights(trip)
    hotels_task = hotels_service.search_hotels(trip)
    cars_task = cars_service.search_cars(trip)
    
    flights, hotels, cars = await asyncio.gather(flights_task, hotels_task, cars_task)
    
    # 6. Fallback to connecting flights if no direct flights found
    used_connecting = False
    if not flights:
        flights = await flights_service.search_connecting_flights(trip)
        used_connecting = True
    else:
        # Check if returned flights have layovers (meaning they are connecting)
        if flights and all(f.layovers > 0 for f in flights):
            used_connecting = True
    
    # 7. Score
    bundles = create_bundles(trip, flights, hotels, cars)

    if not bundles:
        return {
            "message": "I couldn't find any trips matching your criteria.",
            "extracted_data": trip.model_dump()
        }

    # 6. Persist to DB
    db_trip = TripRequestDB(
        user_query=request.message,
        origin=trip.origin,
        destination=trip.destination,
        start_date=trip.start_date,
        end_date=trip.end_date,
        travelers=trip.travelers,
        budget=trip.budget
    )
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)

    for b in bundles:
        db_rec = RecommendationDB(
            trip_request_id=db_trip.id,
            flight_airline=b.flight.airline,
            flight_price=b.flight.price,
            hotel_name=b.hotel.name,
            hotel_price=b.hotel.price_per_night,
            car_company=b.car_rental.company if b.car_rental else None,
            car_type=b.car_rental.car_type if b.car_rental else None,
            car_price=b.car_rental.price_per_day if b.car_rental else None,
            total_price=b.total_price,
            score=b.score,
            reasoning=b.reasoning
        )
        db.add(db_rec)

    db.commit()
    
    # 8. Format response
    recommendations = []
    for b in bundles:
        flight_info = {
            "airline": b.flight.airline,
            "price": b.flight.price,
            "layovers": b.flight.layovers
        }
        if b.flight.via:
            flight_info["via"] = b.flight.via
        if b.flight.legs:
            flight_info["legs"] = [leg.model_dump() for leg in b.flight.legs]
        
        rec = {
            "flight": flight_info,
            "hotel": {
                "name": b.hotel.name,
                "price_per_night": b.hotel.price_per_night,
                "rating": b.hotel.rating
            },
            "total_price": b.total_price,
            "reasoning": b.reasoning
        }
        if b.car_rental:
            rec["car_rental"] = {
                "company": b.car_rental.company,
                "car_type": b.car_rental.car_type,
                "price_per_day": b.car_rental.price_per_day
            }
        recommendations.append(rec)
    
    # 10. Fetch visa info (if nationality provided)
    visa_info = None
    if trip.nationality and trip.destination:
        visa_info_obj = await visa_service.get_visa_info(trip.destination, trip.nationality)
        if visa_info_obj:
            visa_info = visa_info_obj.model_dump()
    
    # 11. Build response message
    from app.config.locations import iata_to_name
    origin_name = iata_to_name(trip.origin)
    dest_name = iata_to_name(trip.destination)
    
    if used_connecting and bundles:
        if bundles[0].flight.via:
            via_hub = bundles[0].flight.via
            via_name = iata_to_name(via_hub)
            message = (
                f"There are no direct flights from {origin_name} to {dest_name}, "
                f"but I found {len(bundles)} great connecting options! "
                f"You'll fly from {origin_name} to {via_name}, then connect to {dest_name}."
            )
        else:
            # Build route descriptions from the bundles
            layovers = bundles[0].flight.layovers
            message = (
                f"There are no direct flights from {origin_name} to {dest_name}, "
                f"but I found {len(bundles)} connecting options with {layovers} stop(s).\n\n"
            )
            # Describe each option briefly
            for i, b in enumerate(bundles[:3], 1):
                if b.flight.legs:
                    route_parts = []
                    for leg in b.flight.legs:
                        leg_origin = iata_to_name(leg.origin)
                        leg_dest = iata_to_name(leg.destination)
                        route_parts.append(f"{leg_origin} → {leg_dest}")
                    route_str = ", then ".join(route_parts)
                    message += f"Option {i}: {route_str} (${b.flight.price})\n"
                else:
                    message += f"Option {i}: {origin_name} → {dest_name} with {layovers} stop(s) (${b.flight.price})\n"
    else:
        message = f"Found {len(bundles)} great options for you!"
    
    response = {
        "message": message,
        "recommendations": recommendations,
        "extracted_data": trip.model_dump()
    }
    
    if visa_info:
        response["visa_info"] = visa_info
    
    return response
