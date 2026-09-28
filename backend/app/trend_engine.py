from dataclasses import dataclass
from typing import Optional

from .temporal_features import (
    TemporalFeatures,
)


@dataclass
class AtmosphericTrend:
    rainfall_trend: str
    instability_trend: str
    moisture_trend: str
    pressure_trend: str
    wind_trend: str


def _classify_change(
    value: Optional[float],
    *,
    rising_threshold: float,
    falling_threshold: float,
) -> str:

    if value is None:
        return "unknown"

    if value >= rising_threshold:
        return "rising"

    if value <= falling_threshold:
        return "falling"

    return "stable"


def classify_atmospheric_trends(
    features: TemporalFeatures,
) -> AtmosphericTrend:

    return AtmosphericTrend(
        rainfall_trend=_classify_change(
            features.rainfall_change,
            rising_threshold=5.0,
            falling_threshold=-5.0,
        ),
        instability_trend=_classify_change(
            features.cape_change,
            rising_threshold=500.0,
            falling_threshold=-500.0,
        ),
        moisture_trend=_classify_change(
            features.humidity_change,
            rising_threshold=5.0,
            falling_threshold=-5.0,
        ),
        pressure_trend=_classify_change(
            features.pressure_change,
            rising_threshold=2.0,
            falling_threshold=-2.0,
        ),
        wind_trend=_classify_change(
            features.wind_speed_change,
            rising_threshold=5.0,
            falling_threshold=-5.0,
        ),
    )
