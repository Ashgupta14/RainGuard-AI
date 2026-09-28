from dataclasses import dataclass
from typing import Optional


@dataclass
class LiveObservation:
    latitude: float
    longitude: float

    temperature: Optional[float] = None
    humidity: Optional[float] = None
    pressure: Optional[float] = None
    rainfall: Optional[float] = None

    wind_speed: Optional[float] = None
    wind_direction: Optional[float] = None

    cape: Optional[float] = None
    cin: Optional[float] = None
    integrated_water_vapour: Optional[float] = None

    timestamp: Optional[str] = None

    provider: str = "unknown"


class LiveWeatherProvider:
    """
    Provider contract for live atmospheric observations.

    Concrete providers should implement fetch_observations().
    """

    name: str = "unknown"

    def fetch_observations(
        self,
        coordinates: list[tuple[float, float]],
    ) -> list[LiveObservation]:
        raise NotImplementedError
