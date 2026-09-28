from pydantic import BaseModel
from typing import Optional

class HistoricalObservation(BaseModel):
    timestamp: str
    latitude: float
    longitude: float
    rainfall: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    pressure: Optional[float] = None
    cape: Optional[float] = None
    cin: Optional[float] = None
    wind_speed: Optional[float] = None
    risk_score: Optional[int] = None
    hazard: Optional[str] = None
