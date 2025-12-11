from typing import Optional, List
from pydantic import BaseModel

class LegInfo(BaseModel):
    airline: str
    origin: str
    destination: str
    departure: str
    arrival: str

class FlightOffer(BaseModel):
    airline: str
    price: int
    departure: str
    arrival: str
    layovers: int
    legs: Optional[List[LegInfo]] = None  # For multi-leg itineraries
    via: Optional[str] = None  # Hub used for connecting flight

class HotelOffer(BaseModel):
    name: str
    price_per_night: int
    rating: float
    distance_km: float

class CarRentalOffer(BaseModel):
    company: str
    car_type: str
    price_per_day: int
    rating: float

class TripBundle(BaseModel):
    flight: FlightOffer
    hotel: HotelOffer
    car_rental: Optional[CarRentalOffer] = None
    total_price: int
    score: float
    reasoning: str
