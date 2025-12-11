from datetime import datetime, timedelta
from app.models.recommendation import FlightOffer, LegInfo

MIN_LAYOVER_HOURS = 1.5
MAX_LAYOVER_HOURS = 8

def parse_datetime(dt_str: str) -> datetime:
    """Parse ISO datetime string."""
    # Handle various formats
    for fmt in ["%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M"]:
        try:
            return datetime.strptime(dt_str, fmt)
        except ValueError:
            continue
    raise ValueError(f"Unable to parse datetime: {dt_str}")

def is_valid_layover(arrival_time: str, departure_time: str) -> bool:
    """
    Check if layover time is valid (between MIN and MAX hours).
    """
    try:
        arrival = parse_datetime(arrival_time)
        departure = parse_datetime(departure_time)
        
        layover = departure - arrival
        layover_hours = layover.total_seconds() / 3600
        
        return MIN_LAYOVER_HOURS <= layover_hours <= MAX_LAYOVER_HOURS
    except Exception:
        return False

def combine_legs(leg1: FlightOffer, leg2: FlightOffer, hub: str, origin: str = None, destination: str = None) -> FlightOffer:
    """
    Combine two flight offers into a single connecting flight.
    """
    leg1_info = LegInfo(
        airline=leg1.airline,
        origin=origin or "???",
        destination=hub,
        departure=leg1.departure,
        arrival=leg1.arrival
    )
    
    leg2_info = LegInfo(
        airline=leg2.airline,
        origin=hub,
        destination=destination or "???",
        departure=leg2.departure,
        arrival=leg2.arrival
    )
    
    total_price = leg1.price + leg2.price
    
    return FlightOffer(
        airline=f"{leg1.airline} + {leg2.airline}",
        price=total_price,
        departure=leg1.departure,
        arrival=leg2.arrival,
        layovers=1,
        via=hub,
        legs=[leg1_info, leg2_info]
    )
