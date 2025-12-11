import asyncio
import os
from dotenv import load_dotenv
from app.services.amadeus_service import AmadeusFlightsService
from app.models.trip_request import TripExtraction

# Load env vars
load_dotenv(dotenv_path="app/.env")

async def test_amadeus():
    print("Testing Amadeus API Integration...")
    client_id = os.getenv("AMADEUS_CLIENT_ID")
    client_secret = os.getenv("AMADEUS_CLIENT_SECRET")
    
    if not client_id or not client_secret:
        print("❌ Error: AMADEUS_CLIENT_ID or AMADEUS_CLIENT_SECRET not found in .env")
        return

    print(f"Client ID found: {client_id[:4]}...")
    
    service = AmadeusFlightsService()
    
    # Create a realistic trip request
    # Note: Dates must be in the future for the API to return results
    trip = TripExtraction(
        origin="LHR", # London
        destination="JFK", # New York
        start_date="2025-12-20",
        end_date="2025-12-25",
        travelers=1,
        budget=5000
    )
    
    try:
        offers = await service.search_flights(trip)
        if offers:
            print(f"✅ Success! Found {len(offers)} flight offers.")
            for offer in offers:
                print(f" - {offer.airline}: ${offer.price} ({offer.layovers} layovers)")
        else:
            print("⚠️ No offers found (but API call succeeded).")
            
    except Exception as e:
        print(f"❌ API Call Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_amadeus())
