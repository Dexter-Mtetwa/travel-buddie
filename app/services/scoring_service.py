from typing import List, Optional
from datetime import datetime
from app.models.trip_request import TripExtraction
from app.models.recommendation import FlightOffer, HotelOffer, CarRentalOffer, TripBundle

def create_bundles(
    trip: TripExtraction, 
    flights: List[FlightOffer], 
    hotels: List[HotelOffer],
    cars: Optional[List[CarRentalOffer]] = None
) -> List[TripBundle]:
    bundles = []
    
    # Calculate nights
    try:
        start = datetime.strptime(trip.start_date, "%Y-%m-%d")
        end = datetime.strptime(trip.end_date, "%Y-%m-%d")
        nights = (end - start).days
        if nights < 1: nights = 1
    except:
        nights = 1 # Fallback
    
    # Use first car if available
    car = cars[0] if cars else None
    car_total = (car.price_per_day * nights) if car else 0
    
    for flight in flights:
        for hotel in hotels:
            # Calculate total price
            total_price = flight.price + (hotel.price_per_night * nights) + car_total
            
            # Score (Soft Budget)
            base_score = hotel.rating * 20
            
            if trip.budget:
                budget_diff = trip.budget - total_price
                if budget_diff >= 0:
                    budget_score = budget_diff / 10
                    over_budget = False
                else:
                    budget_score = budget_diff / 5  # Penalty for over budget
                    over_budget = True
            else:
                budget_score = 0
                over_budget = False
                
            score = base_score + budget_score
            
            # Reasoning
            if over_budget:
                reasoning = f"Flight with {flight.airline} and {hotel.name}. Over budget by ${abs(int(trip.budget - total_price))}."
            else:
                reasoning = f"Flight with {flight.airline} and {hotel.name}. Hotel rating {hotel.rating}/5."
            
            bundles.append(TripBundle(
                flight=flight,
                hotel=hotel,
                car_rental=car,
                total_price=total_price,
                score=round(score, 2),
                reasoning=reasoning
            ))
            
    # Sort by score desc
    bundles.sort(key=lambda x: x.score, reverse=True)
    
    # Return top 3 (always return something)
    return bundles[:3] if bundles else []
