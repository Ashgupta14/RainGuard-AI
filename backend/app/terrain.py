from dataclasses import dataclass
from typing import Optional


@dataclass
class TerrainObservation:
    latitude: float
    longitude: float

    elevation_m: Optional[float] = None
    slope_degrees: Optional[float] = None

    drainage_score: Optional[float] = None
    flow_accumulation_proxy: Optional[float] = None

    source: str = "synthetic-terrain-proxy"


@dataclass
class TerrainFeatures:
    elevation_m: Optional[float]
    slope_degrees: Optional[float]
    drainage_score: Optional[float]
    flow_accumulation_proxy: Optional[float]

    feature_count: int
    completeness: float
    source: str


class TerrainProvider:
    name: str = "unknown"

    def get_terrain(
        self,
        latitude: float,
        longitude: float,
    ) -> TerrainObservation:
        raise NotImplementedError


def build_terrain_features(
    observation: TerrainObservation,
) -> TerrainFeatures:

    values = [
        observation.elevation_m,
        observation.slope_degrees,
        observation.drainage_score,
        observation.flow_accumulation_proxy,
    ]

    feature_count = sum(
        value is not None
        for value in values
    )

    completeness = (
        feature_count / len(values)
        if values
        else 0.0
    )

    return TerrainFeatures(
        elevation_m=observation.elevation_m,
        slope_degrees=observation.slope_degrees,
        drainage_score=observation.drainage_score,
        flow_accumulation_proxy=observation.flow_accumulation_proxy,
        feature_count=feature_count,
        completeness=round(completeness, 3),
        source=observation.source,
    )
