from dataclasses import dataclass
from typing import Optional

from .atmospheric_history import (
    AtmosphericSnapshot,
)
from .temporal_features import (
    TemporalFeatures,
    calculate_temporal_features,
)
from .trend_engine import (
    AtmosphericTrend,
    classify_atmospheric_trends,
)
from .temporal_risk import (
    TemporalRiskSignal,
    calculate_temporal_risk,
)


@dataclass
class AtmosphericIntelligence:
    current: AtmosphericSnapshot
    temporal_features: TemporalFeatures
    trend: AtmosphericTrend
    temporal_risk: TemporalRiskSignal


def build_atmospheric_intelligence(
    current: AtmosphericSnapshot,
    previous: Optional[
        AtmosphericSnapshot
    ] = None,
) -> AtmosphericIntelligence:

    temporal_features = (
        calculate_temporal_features(
            current,
            previous,
        )
    )

    trend = (
        classify_atmospheric_trends(
            temporal_features
        )
    )

    temporal_risk = (
        calculate_temporal_risk(
            trend
        )
    )

    return AtmosphericIntelligence(
        current=current,
        temporal_features=temporal_features,
        trend=trend,
        temporal_risk=temporal_risk,
    )
