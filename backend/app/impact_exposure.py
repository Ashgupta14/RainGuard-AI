from dataclasses import dataclass
from typing import Optional


@dataclass
class ImpactExposure:
    population_density: Optional[float] = None
    road_exposure: Optional[float] = None
    building_exposure: Optional[float] = None
    critical_infrastructure_exposure: Optional[float] = None

    source: str = "synthetic-exposure-proxy"


@dataclass
class ImpactFeatures:
    population_density: Optional[float]
    road_exposure: Optional[float]
    building_exposure: Optional[float]
    critical_infrastructure_exposure: Optional[float]

    feature_count: int
    completeness: float
    source: str


def build_impact_features(
    exposure: ImpactExposure,
) -> ImpactFeatures:

    values = [
        exposure.population_density,
        exposure.road_exposure,
        exposure.building_exposure,
        exposure.critical_infrastructure_exposure,
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

    return ImpactFeatures(
        population_density=exposure.population_density,
        road_exposure=exposure.road_exposure,
        building_exposure=exposure.building_exposure,
        critical_infrastructure_exposure=(
            exposure.critical_infrastructure_exposure
        ),
        feature_count=feature_count,
        completeness=round(completeness, 3),
        source=exposure.source,
    )
