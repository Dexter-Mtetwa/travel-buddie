from typing import List
from app.models.trip_request import TripExtraction
from app.models.recommendation import FlightOffer, LegInfo
from app.services.interfaces import IFlightsService
from app.config.hubs import get_hubs_for_origin

class MockFlightsService(IFlightsService):
    async def search_flights(self, trip: TripExtraction) -> List[FlightOffer]:
        """
        Mock flights service.
        In a real app, this would call Amadeus API.
        """
        # For transatlantic routes like JFK->LON, assume no direct flights
        # to demonstrate connecting flight logic
        if trip.origin in ["JFK", "NYC"] and trip.destination in ["LON", "LHR"]:
            # No direct flights - return empty list to force connecting search
            return []

        # For other routes, return mock direct flights
        f1 = FlightOffer(
            airline="Qatar Airways",
            price=1200,
            departure=f"{trip.start_date}T10:20",
            arrival=f"{trip.start_date}T22:40",
            layovers=1
        )

        f2 = FlightOffer(
            airline="Emirates",
            price=1500,
            departure=f"{trip.start_date}T14:00",
            arrival=f"{trip.start_date}T23:00",
            layovers=0
        )

        f3 = FlightOffer(
            airline="FlyDubai",
            price=900,
            departure=f"{trip.start_date}T06:00",
            arrival=f"{trip.start_date}T20:00",
            layovers=2
        )

        return [f1, f2, f3]
    
    async def search_connecting_flights(self, trip: TripExtraction) -> List[FlightOffer]:
        """
        Search for connecting flights via major hubs.
        """
        hubs = get_hubs_for_origin(trip.origin)[:2]  # Try top 2 hubs
        connecting_flights = []
        
        for hub in hubs:
            # Mock: Create a connecting itinerary via this hub
            leg1 = LegInfo(
                airline="South African Airways",
                origin=trip.origin,
                destination=hub,
                departure=f"{trip.start_date}T08:00",
                arrival=f"{trip.start_date}T12:00"
            )
            
            leg2 = LegInfo(
                airline="Emirates" if hub == "DXB" else "Ethiopian",
                origin=hub,
                destination=trip.destination,
                departure=f"{trip.start_date}T15:00",
                arrival=f"{trip.start_date}T23:00"
            )
            
            # Combined offer
            connecting_flights.append(FlightOffer(
                airline=f"{leg1.airline} + {leg2.airline}",
                price=1800 if hub == "JNB" else 2100,
                departure=leg1.departure,
                arrival=leg2.arrival,
                layovers=1,
                via=hub,
                legs=[leg1, leg2]
            ))
        
        return connecting_flights
