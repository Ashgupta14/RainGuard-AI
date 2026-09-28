from dataclasses import dataclass
from typing import Optional

from .atmospheric_history import (
    AtmosphericSnapshot,
)
from .temporal_features import (
    TemporalFeatures,
)


@dataclass
class ForecastFeatureVector:
    temperature: Optional[float]
    humidity: Optional[float]
    pressure: Optional[float]
    rainfall: Optional[float]

    cape: Optional[float]
    cin: Optional[float]

    wind_speed: Optional[float]
    wind_direction: Optional[float]

    rainfall_change: Optional[float]
    humidity_change: Optional[float]
    pressure_change: Optional[float]
    cape_change: Optional[float]
    cin_change: Optional[float]
    wind_speed_change: Optional[float]

    feature_count: int
    completeness: float


def _count_available(
    values: list[Optional[float]],
) -> tuple[int, float]:

    available = sum(
        value is not None
        for value in values
    )

    total = len(values)

    completeness = (
        available / total
        if total
        else 0.0
    )

    return available, round(
        completeness,
        3,
    )


def build_forecast_features(
    current: AtmosphericSnapshot,
    temporal: TemporalFeatures,
) -> ForecastFeatureVector:

    values = [
        current.temperature,
        current.humidity,
        current.pressure,
        current.rainfall,
        current.cape,
        current.cin,
        current.wind_speed,
        current.wind_direction,
        temporal.rainfall_change,
        temporal.humidity_change,
        temporal.pressure_change,
        temporal.cape_change,
        temporal.cin_change,
        temporal.wind_speed_change,
    ]

    feature_count, completeness = (
        _count_available(values)
    )

    return ForecastFeatureVector(
        temperature=current.temperature,
        humidity=current.humidity,
        pressure=current.pressure,
        rainfall=current.rainfall,
        cape=current.cape,
        cin=current.cin,
        wind_speed=current.wind_speed,
        wind_direction=current.wind_direction,
        rainfall_change=temporal.rainfall_change,
        humidity_change=temporal.humidity_change,
        pressure_change=temporal.pressure_change,
        cape_change=temporal.cape_change,
        cin_change=temporal.cin_change,
        wind_speed_change=temporal.wind_speed_change,
        feature_count=feature_count,
        completeness=completeness,
    )
