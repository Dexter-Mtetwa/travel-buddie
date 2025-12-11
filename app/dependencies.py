from app.services.interfaces import IFlightsService, IHotelsService, INLPService, ICarRentalService
from app.services.flights_service import MockFlightsService
from app.services.hotels_service import MockHotelsService
from app.services.amadeus_service import AmadeusFlightsService
from app.services.nlp_service import RegexNLPService
from app.services.openai_service import OpenAINLPService
from app.services.car_rental_service import MockCarRentalService
import os

def get_flights_service() -> IFlightsService:
    if os.getenv("USE_REAL_API") == "true":
        return AmadeusFlightsService()
    return MockFlightsService()

def get_hotels_service() -> IHotelsService:
    return MockHotelsService()

def get_nlp_service() -> INLPService:
    if os.getenv("OPENAI_API_KEY"):
        return OpenAINLPService()
    return RegexNLPService()

def get_cars_service() -> ICarRentalService:
    return MockCarRentalService()

def get_visa_service():
    from app.services.visa_service import TravelbriefingVisaService
    return TravelbriefingVisaService()
