from pydantic import BaseModel
from typing import List

class MLFeatureVector(BaseModel):
    iwv: float = 0.0
    cape: float = 0.0
    cin: float = 0.0
    wind_convergence: float = 0.0
    wind_shear: float = 0.0
    rainfall: float = 0.0
    rainfall_change: float = 0.0
    humidity: float = 0.0
    pressure_change: float = 0.0
    temporal_risk: float = 0.0
    terrain_risk: float = 0.0
    exposure_risk: float = 0.0
    historical_anomaly: float = 0.0
    
    feature_count: int = 13
    completeness: float = 100.0
    feature_names: List[str] = [
        "iwv", "cape", "cin", "wind_convergence", "wind_shear",
        "rainfall", "rainfall_change", "humidity", "pressure_change",
        "temporal_risk", "terrain_risk", "exposure_risk", "historical_anomaly"
    ]
