import httpx
from typing import Optional
from app.models.visa_info import VisaInfo

# Country name to code mapping (for common countries)
COUNTRY_CODES = {
    "zimbabwe": "ZW",
    "south africa": "ZA",
    "kenya": "KE",
    "usa": "US",
    "united states": "US",
    "uk": "GB",
    "united kingdom": "GB",
    "china": "CN",
    "india": "IN",
    "japan": "JP",
    "germany": "DE",
    "france": "FR",
}

class TravelbriefingVisaService:
    BASE_URL = "https://travelbriefing.org"
    
    async def get_visa_info(self, destination: str, nationality: str) -> Optional[VisaInfo]:
        """
        Get visa requirements for a destination country based on traveler nationality.
        """
        # Normalize destination (Travelbriefing uses country names)
        dest_name = self._normalize_country(destination)
        nat_code = COUNTRY_CODES.get(nationality.lower(), nationality.upper())
        
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(
                    f"{self.BASE_URL}/{dest_name}",
                    params={"format": "json"}
                )
                
                if response.status_code != 200:
                    print(f"Travelbriefing API error: {response.status_code}")
                    return None
                
                data = response.json()
                
                # Parse visa info
                visa_data = data.get("visa", {})
                
                # Find visa requirement for this nationality
                visa_required = True
                visa_type = "Traditional visa"
                notes = None
                
                # Check visa-free list
                visa_free = visa_data.get("visa-free", [])
                for entry in visa_free:
                    if entry.get("code") == nat_code:
                        visa_required = False
                        visa_type = "Visa-free"
                        notes = entry.get("note")
                        break
                
                # Check visa-on-arrival list
                if visa_required:
                    voa = visa_data.get("visa-on-arrival", [])
                    for entry in voa:
                        if entry.get("code") == nat_code:
                            visa_type = "Visa on arrival"
                            notes = entry.get("note")
                            break
                
                # Get passport validity requirement
                passport = data.get("passport", {})
                passport_validity = passport.get("validity")
                
                return VisaInfo(
                    destination=dest_name,
                    nationality=nationality,
                    visa_required=visa_required,
                    visa_type=visa_type,
                    passport_validity=passport_validity,
                    notes=notes
                )
                
        except Exception as e:
            print(f"Error fetching visa info: {e}")
            return None
    
    def _normalize_country(self, country: str) -> str:
        """Convert IATA code or country name to Travelbriefing format."""
        # IATA to country name mapping
        iata_to_country = {
            "NRT": "Japan",
            "HND": "Japan",
            "KIX": "Japan",
            "LHR": "United-Kingdom",
            "CDG": "France",
            "JFK": "United-States",
            "DXB": "United-Arab-Emirates",
            "JNB": "South-Africa",
            "HRE": "Zimbabwe",
        }
        
        if country.upper() in iata_to_country:
            return iata_to_country[country.upper()]
        
        # Normalize country name (replace spaces with hyphens, capitalize)
        return country.replace(" ", "-").title()
