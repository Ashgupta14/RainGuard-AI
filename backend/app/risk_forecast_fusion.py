from pydantic import BaseModel
from typing import List
from .forecast_model import ForecastPrediction
from .temporal_risk import TemporalRiskSignal

class FusedRiskSignal(BaseModel):
    score: int
    level: str
    contributing_factors: List[str]

def fuse_risk_signals(
    current_risk_score: int, 
    forecast: ForecastPrediction, 
    temporal_risk: TemporalRiskSignal
) -> FusedRiskSignal:
    score = current_risk_score
    factors = []
    
    factors.append(f"Forecast model ({forecast.model_name}) is baseline (trained={forecast.is_trained_model})")

    if forecast.risk_score > current_risk_score:
        score += (forecast.risk_score - current_risk_score) * 0.5
        factors.extend(forecast.explanation)
        
    if temporal_risk.score > 30:
        score += temporal_risk.score * 0.3
        factors.extend(temporal_risk.contributing_signals)
        
    score = min(100, int(score))
    
    if score >= 80:
        level = "Critical"
    elif score >= 60:
        level = "High"
    elif score >= 30:
        level = "Moderate"
    else:
        level = "Low"
        
    return FusedRiskSignal(score=score, level=level, contributing_factors=factors)
