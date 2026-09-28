from pydantic import BaseModel

class FutureRiskConfidence(BaseModel):
    overall: int
    explanation: str

def calculate_future_risk_confidence(
    data_completeness: int,
    temporal_history_available: bool,
    provider_quality: int,
    spatial_coverage: int,
    forecast_feature_availability: int
) -> FutureRiskConfidence:
    score = (data_completeness + provider_quality + spatial_coverage + forecast_feature_availability) / 4.0
    if not temporal_history_available:
        score *= 0.8
    score = int(max(0, min(100, score)))
    
    explanation = f"Confidence {score}% based on data completeness ({data_completeness}%), provider quality ({provider_quality}%), and forecast features ({forecast_feature_availability}%)."
    if not temporal_history_available:
        explanation += " Reduced due to missing temporal history."
        
    return FutureRiskConfidence(overall=score, explanation=explanation)
