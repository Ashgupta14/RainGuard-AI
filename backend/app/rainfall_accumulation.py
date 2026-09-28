from pydantic import BaseModel
from .rainfall_trend import classify_rainfall_intensity

class RainfallAccumulation(BaseModel):
    current_rainfall: float
    short_window_accumulation: float
    acceleration: float
    intensity_category: str
    accumulation_risk_score: int
    accumulation_risk_level: str

def calculate_rainfall_accumulation(current: float, past_window: float = 0.0) -> RainfallAccumulation:
    accumulation = current + past_window
    acceleration = current - past_window if past_window > 0 else 0.0
    intensity = classify_rainfall_intensity(current)
    
    risk_score = min(100, int((accumulation * 5) + (max(0, acceleration) * 2)))
    level = "Low"
    if risk_score > 75:
        level = "Critical"
    elif risk_score > 50:
        level = "High"
    elif risk_score > 25:
        level = "Moderate"
        
    return RainfallAccumulation(
        current_rainfall=current,
        short_window_accumulation=accumulation,
        acceleration=acceleration,
        intensity_category=intensity,
        accumulation_risk_score=risk_score,
        accumulation_risk_level=level
    )
