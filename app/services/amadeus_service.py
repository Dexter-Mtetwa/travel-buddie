import httpx
import os
from typing import List
from app.models.trip_request import TripExtraction
from app.models.recommendation import FlightOffer
from app.services.interfaces import IFlightsService

class AmadeusFlightsService(IFlightsService):
    def __init__(self):
        self.client_id = os.getenv("AMADEUS_CLIENT_ID")
        self.client_secret = os.getenv("AMADEUS_CLIENT_SECRET")
        self.base_url = "https://test.api.amadeus.com" # Sandbox environment
        self.token = None
        
        if not self.client_id or not self.client_secret:
            raise ValueError("AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET must be set when using AmadeusFlightsService")

    async def _authenticate(self):
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/v1/security/oauth2/token",
                data={
                    "grant_type": "client_credentials",
                    "client_id": self.client_id,
                    "client_secret": self.client_secret
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            response.raise_for_status()
            self.token = response.json()["access_token"]

    async def search_flights(self, trip: TripExtraction) -> List[FlightOffer]:
        if not self.token:
            await self._authenticate()
            
        async with httpx.AsyncClient(timeout=60.0) as client:
            params = {
                "originLocationCode": trip.origin,
                "destinationLocationCode": trip.destination,
                "departureDate": trip.start_date,
                "adults": trip.travelers,
                "currencyCode": "USD",
                "max": 5
            }
            
            # Amadeus returnDate is optional, but if provided it makes it a round trip
            if trip.end_date:
                 params["returnDate"] = trip.end_date

            try:
                response = await client.get(
                    f"{self.base_url}/v2/shopping/flight-offers",
                    headers={"Authorization": f"Bearer {self.token}"},
                    params=params
                )
                
                if response.status_code == 401:
                    # Token might have expired, retry once
                    await self._authenticate()
                    response = await client.get(
                        f"{self.base_url}/v2/shopping/flight-offers",
                        headers={"Authorization": f"Bearer {self.token}"},
                        params=params
                    )
                
                response.raise_for_status()
                data = response.json()
                
                offers = []
                for offer in data.get("data", []):
                    itineraries = offer["itineraries"]
                    price = float(offer["price"]["total"])
                    
                    # First segment of first itinerary (Outbound)
                    first_seg = itineraries[0]["segments"][0]
                    departure = first_seg["departure"]["at"]
                    
                    # Last segment of first itinerary
                    last_seg = itineraries[0]["segments"][-1]
                    arrival = last_seg["arrival"]["at"]
                    
                    airline_code = first_seg["carrierCode"]
                    layovers = len(itineraries[0]["segments"]) - 1
                    
                    offers.append(FlightOffer(
                        airline=f"Airline {airline_code}", # Placeholder for IATA lookup
                        price=int(price),
                        departure=departure,
                        arrival=arrival,
                        layovers=layovers
                    ))
                    
                return offers
                
            except httpx.HTTPStatusError as e:
                print(f"Amadeus API Status Error: {e.response.status_code} - {e.response.text}")
                return []
            except Exception as e:
                import traceback
                traceback.print_exc()
                print(f"Error searching flights: {e}")
                return []

    async def _search_one_way(self, origin: str, destination: str, date: str, travelers: int) -> List[FlightOffer]:
        """Search one-way flights for a leg."""
        if not self.token:
            await self._authenticate()
            
        async with httpx.AsyncClient(timeout=60.0) as client:
            params = {
                "originLocationCode": origin,
                "destinationLocationCode": destination,
                "departureDate": date,
                "adults": travelers,
                "currencyCode": "USD",
                "max": 3
            }
            
            try:
                response = await client.get(
                    f"{self.base_url}/v2/shopping/flight-offers",
                    headers={"Authorization": f"Bearer {self.token}"},
                    params=params
                )
                
                if response.status_code == 401:
                    await self._authenticate()
                    response = await client.get(
                        f"{self.base_url}/v2/shopping/flight-offers",
                        headers={"Authorization": f"Bearer {self.token}"},
                        params=params
                    )
                
                response.raise_for_status()
                data = response.json()
                
                offers = []
                for offer in data.get("data", []):
                    itineraries = offer["itineraries"]
                    price = float(offer["price"]["total"])
                    first_seg = itineraries[0]["segments"][0]
                    last_seg = itineraries[0]["segments"][-1]
                    
                    offers.append(FlightOffer(
                        airline=first_seg["carrierCode"],
                        price=int(price),
                        departure=first_seg["departure"]["at"],
                        arrival=last_seg["arrival"]["at"],
                        layovers=len(itineraries[0]["segments"]) - 1
                    ))
                    
                return offers
            except Exception as e:
                print(f"Error searching one-way flights {origin}->{destination}: {e}")
                return []

    async def search_connecting_flights(self, trip: TripExtraction) -> List[FlightOffer]:
        """Search for connecting flights via major hubs."""
        from app.config.hubs import get_hubs_for_origin
        from app.services.flight_utils import is_valid_layover, combine_legs
        from app.services.flights_service import MockFlightsService

        hubs = get_hubs_for_origin(trip.origin)[:2]
        connecting_flights = []
        consecutive_failures = 0

        for hub in hubs:
            # Search origin -> hub
            leg1_offers = await self._search_one_way(trip.origin, hub, trip.start_date, trip.travelers)

            if not leg1_offers:
                consecutive_failures += 1
                continue

            # Search hub -> destination
            leg2_offers = await self._search_one_way(hub, trip.destination, trip.start_date, trip.travelers)

            if not leg2_offers:
                consecutive_failures += 1
                continue

            consecutive_failures = 0  # Reset on success

            # Combine valid itineraries
            for leg1 in leg1_offers[:2]:  # Limit combinations
                for leg2 in leg2_offers[:2]:
                    if is_valid_layover(leg1.arrival, leg2.departure):
                        combined = combine_legs(leg1, leg2, hub, trip.origin, trip.destination)
                        connecting_flights.append(combined)

        # If all attempts failed, fall back to mock data
        if not connecting_flights and consecutive_failures >= len(hubs):
            print(f"All Amadeus connecting flight searches failed, falling back to mock data")
            mock_service = MockFlightsService()
            connecting_flights = await mock_service.search_connecting_flights(trip)

        return connecting_flights
