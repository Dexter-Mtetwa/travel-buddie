from typing import List
from app.models.trip_request import TripExtraction
from app.models.recommendation import CarRentalOffer
from app.services.interfaces import ICarRentalService

class MockCarRentalService(ICarRentalService):
    async def search_cars(self, trip: TripExtraction) -> List[CarRentalOffer]:
        """
        Mock car rental service.
        """
        # Mock data
        c1 = CarRentalOffer(
            company="Hertz",
            car_type="Economy",
            price_per_day=45,
            rating=4.2
        )
        
        c2 = CarRentalOffer(
            company="Avis",
            car_type="SUV",
            price_per_day=85,
            rating=4.5
        )
        
        c3 = CarRentalOffer(
            company="Enterprise",
            car_type="Convertible",
            price_per_day=120,
            rating=4.8
        )
        
        return [c1, c2, c3]
