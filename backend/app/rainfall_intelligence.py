from pydantic import BaseModel
from .rainfall_trend import classify_rainfall_intensity, classify_rainfall_trend

class RainfallIntelligence(BaseModel):
    current_rainfall: float
    accumulated_rainfall: float
    intensity_category: str
    trend: str
    change: float
    confidence: int
    source: str

def build_rainfall_intelligence(current_rainfall: float, change: float, source: str = "QPE / weather-model observation") -> RainfallIntelligence:
    intensity = classify_rainfall_intensity(current_rainfall)
    trend = classify_rainfall_trend(change)
    return RainfallIntelligence(
        current_rainfall=current_rainfall,
        accumulated_rainfall=current_rainfall,
        intensity_category=intensity,
        trend=trend,
        change=change,
        confidence=90,
        source=source
    )
