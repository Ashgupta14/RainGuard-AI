from pydantic import BaseModel
from .forecast_model import ForecastPrediction
from .temporal_risk import TemporalRiskSignal
from .risk_forecast_fusion import FusedRiskSignal

class FutureRisk(BaseModel):
    current_risk_score: int
    forecast_risk: ForecastPrediction
    temporal_risk: TemporalRiskSignal
    fused_risk: FusedRiskSignal
    rainfall_evolution: str
    confidence: int
    historical_anomaly: str = "normal"
    explanation: str

def build_future_risk(
    current_risk_score: int,
    forecast: ForecastPrediction,
    temporal_risk: TemporalRiskSignal,
    fused_risk: FusedRiskSignal,
    rainfall_evolution: str,
    confidence: int,
    historical_anomaly: str = "normal"
) -> FutureRisk:
    explanation_lines = [
        f"Fused Future Risk: {fused_risk.level.upper()} ({fused_risk.score})",
        "",
        f"Rainfall Evolution: {rainfall_evolution}",
        f"Historical Anomaly: {historical_anomaly}",
        f"Current Risk: {current_risk_score}",
        f"Temporal Risk Level: {temporal_risk.level}",
        f"Forecast Risk Score: {forecast.risk_score}"
    ]
    
    return FutureRisk(
        current_risk_score=current_risk_score,
        forecast_risk=forecast,
        temporal_risk=temporal_risk,
        fused_risk=fused_risk,
        rainfall_evolution=rainfall_evolution,
        confidence=confidence,
        historical_anomaly=historical_anomaly,
        explanation="\n".join(explanation_lines)
    )
