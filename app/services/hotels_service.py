from typing import List
from app.models.trip_request import TripExtraction
from app.models.recommendation import HotelOffer
from app.services.interfaces import IHotelsService

class MockHotelsService(IHotelsService):
    async def search_hotels(self, trip: TripExtraction) -> List[HotelOffer]:
        """
        Mock hotels service.
        """
        # Return appropriate hotels based on destination
        if trip.destination in ["LON", "LHR"]:
            # London hotels
            h1 = HotelOffer(
                name="London Marriott Hotel",
                price_per_night=220,
                rating=4.5,
                distance_km=2.1
            )

            h2 = HotelOffer(
                name="Hilton London",
                price_per_night=180,
                rating=4.2,
                distance_km=1.8
            )

            h3 = HotelOffer(
                name="Budget Hotel London",
                price_per_night=90,
                rating=3.8,
                distance_km=4.5
            )
        else:
            # Default Osaka hotels for other destinations
            h1 = HotelOffer(
                name="Osaka Central Hotel",
                price_per_night=140,
                rating=4.3,
                distance_km=1.2
            )

            h2 = HotelOffer(
                name="Osaka Bay Tower",
                price_per_night=180,
                rating=4.6,
                distance_km=3.5
            )

            h3 = HotelOffer(
                name="Budget Inn Osaka",
                price_per_night=80,
                rating=3.8,
                distance_km=5.0
            )

        return [h1, h2, h3]
