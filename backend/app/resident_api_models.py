from pydantic import BaseModel
from .models import GridCellIntelligence

class LocationRiskRequest(BaseModel):
    latitude: float
    longitude: float

class ResidentRiskSummary(BaseModel):
    risk_level: str
    risk_score: int
    potential_impact: str
    time_to_impact: str
    confidence: int
    what_to_do: str
    disclaimer: str

class LocationRiskResponse(BaseModel):
    latitude: float
    longitude: float
    cell_id: str
    summary: ResidentRiskSummary
    cell_details: GridCellIntelligence
