from dataclasses import dataclass
from typing import Optional

from .atmospheric_history import (
    AtmosphericSnapshot,
)
from .rainfall_intelligence import RainfallIntelligence, build_rainfall_intelligence
from .cloud_evolution import CloudEvolution, build_cloud_evolution


@dataclass
class TemporalFeatures:
    rainfall_change: Optional[float]
    temperature_change: Optional[float]
    humidity_change: Optional[float]
    pressure_change: Optional[float]
    cape_change: Optional[float]
    cin_change: Optional[float]
    wind_speed_change: Optional[float]
    rainfall_intelligence: Optional[RainfallIntelligence] = None
    cloud_evolution: Optional[CloudEvolution] = None


def _change(
    current: Optional[float],
    previous: Optional[float],
) -> Optional[float]:

    if (
        current is None
        or previous is None
    ):
        return None

    return round(
        current - previous,
        3,
    )


def calculate_temporal_features(
    current: AtmosphericSnapshot,
    previous: Optional[
        AtmosphericSnapshot
    ],
) -> TemporalFeatures:

    if previous is None:
        return TemporalFeatures(
            rainfall_change=None,
            temperature_change=None,
            humidity_change=None,
            pressure_change=None,
            cape_change=None,
            cin_change=None,
            wind_speed_change=None,
        )

    rainfall_change = _change(current.rainfall, previous.rainfall)
    rainfall_intel = build_rainfall_intelligence(
        current.rainfall or 0.0, 
        rainfall_change or 0.0
    )
    cloud_evol = build_cloud_evolution()

    return TemporalFeatures(
        rainfall_change=rainfall_change,
        temperature_change=_change(
            current.temperature,
            previous.temperature,
        ),
        humidity_change=_change(
            current.humidity,
            previous.humidity,
        ),
        pressure_change=_change(
            current.pressure,
            previous.pressure,
        ),
        cape_change=_change(
            current.cape,
            previous.cape,
        ),
        cin_change=_change(
            current.cin,
            previous.cin,
        ),
        wind_speed_change=_change(
            current.wind_speed,
            previous.wind_speed,
        ),
        rainfall_intelligence=rainfall_intel,
        cloud_evolution=cloud_evol,
    )
