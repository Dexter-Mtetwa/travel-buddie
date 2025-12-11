# Location name to IATA code mapping
LOCATION_TO_IATA = {
    # Countries (use main airport)
    "zimbabwe": "HRE",
    "south africa": "JNB",
    "kenya": "NBO",
    "ethiopia": "ADD",
    "japan": "NRT",  # Narita
    "usa": "JFK",
    "united states": "JFK",
    "uk": "LHR",
    "united kingdom": "LHR",
    "uae": "DXB",
    "united arab emirates": "DXB",
    "china": "PEK",
    "india": "DEL",
    "france": "CDG",
    "germany": "FRA",
    "australia": "SYD",
    
    # Cities
    "harare": "HRE",
    "johannesburg": "JNB",
    "cape town": "CPT",
    "nairobi": "NBO",
    "addis ababa": "ADD",
    "tokyo": "NRT",
    "osaka": "KIX",
    "kyoto": "KIX",  # Uses Kansai
    "new york": "JFK",
    "nyc": "JFK",
    "new york city": "JFK",
    "los angeles": "LAX",
    "london": "LHR",
    "lon": "LHR",
    "paris": "CDG",
    "dubai": "DXB",
    "doha": "DOH",
    "singapore": "SIN",
    "hong kong": "HKG",
    "beijing": "PEK",
    "shanghai": "PVG",
    "mumbai": "BOM",
    "delhi": "DEL",
    "sydney": "SYD",
    "melbourne": "MEL",
    "frankfurt": "FRA",
    "amsterdam": "AMS",
    "istanbul": "IST",
}

def normalize_to_iata(location: str) -> str:
    """
    Convert a location name or IATA code to a valid IATA code.
    Returns the original if already an IATA code or not found in mapping.
    """
    if not location:
        return location

    # Try to find in mapping first (case-insensitive) - handles non-standard codes like LON->LHR
    normalized = LOCATION_TO_IATA.get(location.lower())
    if normalized:
        return normalized

    # If already a 3-letter code, assume it's valid IATA
    if len(location) == 3 and location.isalpha():
        return location.upper()

    # Return original (might fail, but at least we tried)
    return location

# IATA code to city name mapping (reverse of above)
IATA_TO_NAME = {
    "HRE": "Harare",
    "JNB": "Johannesburg",
    "CPT": "Cape Town",
    "NBO": "Nairobi",
    "ADD": "Addis Ababa",
    "NRT": "Tokyo",
    "KIX": "Osaka",
    "OSA": "Osaka",
    "OSD": "Osaka",
    "JFK": "New York",
    "LAX": "Los Angeles",
    "LHR": "London",
    "LON": "London",  # Handle non-standard codes
    "CDG": "Paris",
    "DXB": "Dubai",
    "DOH": "Doha",
    "SIN": "Singapore",
    "HKG": "Hong Kong",
    "PEK": "Beijing",
    "PVG": "Shanghai",
    "BOM": "Mumbai",
    "DEL": "Delhi",
    "SYD": "Sydney",
    "MEL": "Melbourne",
    "FRA": "Frankfurt",
    "AMS": "Amsterdam",
    "IST": "Istanbul",
}

def iata_to_name(code: str) -> str:
    """Convert IATA code to human-readable city name."""
    if not code:
        return code
    return IATA_TO_NAME.get(code.upper(), code)
