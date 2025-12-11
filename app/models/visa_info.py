from typing import Optional
from pydantic import BaseModel

class VisaInfo(BaseModel):
    destination: str
    nationality: str
    visa_required: bool
    visa_type: Optional[str] = None  # e.g., "Visa-free", "Visa on arrival", "e-Visa", "Traditional visa"
    passport_validity: Optional[str] = None  # e.g., "6 months beyond stay"
    notes: Optional[str] = None
