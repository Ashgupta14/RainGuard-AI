from pydantic import BaseModel
from typing import List

class TemporalRiskFusionResult(BaseModel):
    score: int
    level: str
    signals: List[str]
    confidence: int

def fuse_temporal_risk(
    current_risk_score: int, 
    rainfall_trend: str, 
    atmospheric_trend: str, 
    cloud_evolution: str
) -> TemporalRiskFusionResult:
    score = current_risk_score
    signals = []
    
    if rainfall_trend == "RISING":
        score += 15
        signals.append("Rainfall intensity is increasing.")
    elif rainfall_trend == "FALLING":
        score -= 10
        signals.append("Rainfall intensity is decreasing.")
        
    if atmospheric_trend == "WORSENING":
        score += 15
        signals.append("Atmospheric instability is rising.")
    elif atmospheric_trend == "IMPROVING":
        score -= 10
        signals.append("Atmospheric conditions are stabilizing.")
        
    if cloud_evolution in ["DEVELOPING", "RAPIDLY_DEVELOPING"]:
        score += 10
        signals.append("Cloud evolution indicates rapid growth.")
        
    score = max(0, min(100, score))
    
    level = "Low"
    if score > 75:
        level = "Critical"
    elif score > 50:
        level = "High"
    elif score > 25:
        level = "Moderate"
        
    return TemporalRiskFusionResult(
        score=score,
        level=level,
        signals=signals,
        confidence=85
    )
