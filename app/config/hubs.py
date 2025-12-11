# Major connecting hubs by region
HUBS = {
    "africa": ["JNB", "ADD"],  # Johannesburg, Addis Ababa
    "middle_east": ["DXB", "DOH"],  # Dubai, Doha
    "europe": ["IST", "FRA", "LHR"],  # Istanbul, Frankfurt, London
    "asia": ["SIN", "HKG"],  # Singapore, Hong Kong
}

# Flat list of all hubs
ALL_HUBS = [hub for hubs in HUBS.values() for hub in hubs]

# Regional mapping based on origin airport prefix (simplified)
REGION_MAP = {
    "HRE": "africa",  # Harare
    "JNB": "africa",
    "NBO": "africa",  # Nairobi
    "ADD": "africa",
    "CAI": "middle_east",  # Cairo
    "DXB": "middle_east",
}

def get_hubs_for_origin(origin: str) -> list:
    """
    Get prioritized hubs for a given origin.
    Returns regional hubs first, then other major hubs.
    """
    region = REGION_MAP.get(origin)
    if region:
        regional_hubs = HUBS.get(region, [])
        other_hubs = [h for h in ALL_HUBS if h not in regional_hubs]
        return regional_hubs + other_hubs
    return ALL_HUBS
