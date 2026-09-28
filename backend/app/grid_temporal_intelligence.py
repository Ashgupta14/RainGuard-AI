from pydantic import BaseModel
from typing import Optional
from .atmospheric_history import AtmosphericSnapshot
from .temporal_features import calculate_temporal_features, TemporalFeatures
from .trend_engine import classify_atmospheric_trends, AtmosphericTrend
from .temporal_risk import calculate_temporal_risk, TemporalRiskSignal

class TemporalIntelligence(BaseModel):
    features: TemporalFeatures
    trend: AtmosphericTrend
    risk: TemporalRiskSignal

def build_temporal_intelligence(current: AtmosphericSnapshot, previous: Optional[AtmosphericSnapshot]) -> TemporalIntelligence:
    features = calculate_temporal_features(current, previous)
    trend = classify_atmospheric_trends(features)
    risk = calculate_temporal_risk(trend)
    return TemporalIntelligence(features=features, trend=trend, risk=risk)
