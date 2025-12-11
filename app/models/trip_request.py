from pydantic import BaseModel
from typing import List, Optional

class TripExtraction(BaseModel):
    origin: Optional[str] = None
    destination: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    travelers: Optional[int] = None
    budget: Optional[int] = None
    nationality: Optional[str] = None
    reply_message: Optional[str] = None
    missing_fields: List[str] = []
