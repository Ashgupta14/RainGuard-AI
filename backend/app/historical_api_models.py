from pydantic import BaseModel
from typing import Optional, List

class HistoricalBaseline(BaseModel):
    average_rainfall: Optional[float] = None
    maximum_rainfall: Optional[float] = None
    average_risk: Optional[float] = None
    maximum_risk: Optional[float] = None
    average_cape: Optional[float] = None
    average_humidity: Optional[float] = None

class AnomalyResult(BaseModel):
    status: str
    anomaly_score: float

class RiskFingerprint(BaseModel):
    flood_susceptibility: str
    historical_rainfall_tendency: str
    historical_risk_tendency: str
    terrain_susceptibility: str
    exposure_susceptibility: str
    common_hazards: List[str]

class HistoricalComparison(BaseModel):
    risk_change: str
    rainfall_anomaly: str
    atmospheric_anomaly: str
    overall_anomaly: str
    explanation: str
