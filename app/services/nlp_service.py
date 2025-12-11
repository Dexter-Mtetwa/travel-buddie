import re
import dateparser
from datetime import datetime
from app.models.trip_request import TripExtraction
from app.services.interfaces import INLPService

class RegexNLPService(INLPService):
    async def extract(self, text: str) -> TripExtraction:
        data = {
            "origin": None,
            "destination": None,
            "start_date": None,
            "end_date": None,
            "travelers": None,
            "budget": None,
            "missing_fields": []
        }
        
        # 1. Extract Budget
        budget_match = re.search(r'\$(\d+)|(\d+)\s*(?:dollars|usd)', text, re.IGNORECASE)
        if budget_match:
            amount = budget_match.group(1) or budget_match.group(2)
            data["budget"] = int(amount)
        
        # 2. Extract Travelers
        travelers_match = re.search(r'(\d+)\s*(?:people|person|travelers|pax)', text, re.IGNORECASE)
        if travelers_match:
            data["travelers"] = int(travelers_match.group(1))
            
        # 3. Extract Dates using dateparser
        date_range_match = re.search(r'from\s+(.*?)\s+to\s+(.*?)(?:\s+for|\s+with|\s*$)', text, re.IGNORECASE)
        
        clean_text = text
        
        if date_range_match:
            start_str = date_range_match.group(1).strip()
            end_str = date_range_match.group(2).strip()
            
            start_dt = dateparser.parse(start_str, settings={'PREFER_DATES_FROM': 'future'})
            end_dt = dateparser.parse(end_str, settings={'PREFER_DATES_FROM': 'future'})
            
            if start_dt and end_dt:
                 data["start_date"] = start_dt.strftime("%Y-%m-%d")
                 data["end_date"] = end_dt.strftime("%Y-%m-%d")
                 clean_text = text.replace(date_range_match.group(0), " ")
        
        # 4. Extract Locations
        origin_candidates = re.findall(r'\bfrom\s+([A-Z][a-z]+)', clean_text)
        if origin_candidates:
            data["origin"] = origin_candidates[0]

        dest_candidates = re.findall(r'\bto\s+([A-Z][a-z]+)', clean_text)
        if dest_candidates:
            data["destination"] = dest_candidates[0]

        # Mock Airport Codes
        airport_codes = {
            "Harare": "HRE",
            "London": "LHR",
            "Paris": "CDG",
            "New York": "JFK",
            "Tokyo": "NRT"
        }
        
        if data["origin"] in airport_codes:
            data["origin"] = airport_codes[data["origin"]]
        
        # 5. Check missing fields
        required = ["origin", "destination", "start_date", "end_date", "travelers", "budget"]
        if data["missing_fields"]:
            missing_str = ", ".join(data["missing_fields"])
            data["reply_message"] = f"I need more information. Please provide: {missing_str}"
        else:
            data["reply_message"] = None
            
        return TripExtraction(**data)

# Backwards compatibility for tests if needed, but we should update tests
def extract_trip_data(text: str) -> TripExtraction:
    import asyncio
    service = RegexNLPService()
    # This is a hack for sync tests calling this function directly
    # Ideally we update tests to use the service class
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    return loop.run_until_complete(service.extract(text))
