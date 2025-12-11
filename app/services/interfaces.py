from typing import List, Protocol
from app.models.trip_request import TripExtraction
from app.models.recommendation import FlightOffer, HotelOffer, CarRentalOffer

class IFlightsService(Protocol):
    async def search_flights(self, trip: TripExtraction) -> List[FlightOffer]:
        ...
    
    async def search_connecting_flights(self, trip: TripExtraction) -> List[FlightOffer]:
        ...

class IHotelsService(Protocol):
    async def search_hotels(self, trip: TripExtraction) -> List[HotelOffer]:
        ...

class INLPService(Protocol):
    async def extract(self, text: str) -> TripExtraction:
        ...

class ICarRentalService(Protocol):
    async def search_cars(self, trip: TripExtraction) -> List[CarRentalOffer]:
        ...
