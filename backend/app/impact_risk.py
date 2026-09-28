from dataclasses import dataclass

from .impact_exposure import ImpactFeatures


@dataclass
class ImpactRisk:
    score: int
    level: str
    confidence: int
    contributing_factors: list[str]


def _risk_level(score: int) -> str:

    if score >= 80:
        return "Critical"

    if score >= 60:
        return "High"

    if score >= 30:
        return "Moderate"

    return "Low"


def _clamp(value: float) -> float:
    return max(0.0, min(value, 1.0))


def calculate_impact_risk(
    features: ImpactFeatures,
) -> ImpactRisk:

    factors: list[str] = []

    population = (
        _clamp(features.population_density)
        if features.population_density is not None
        else None
    )

    roads = (
        _clamp(features.road_exposure)
        if features.road_exposure is not None
        else None
    )

    buildings = (
        _clamp(features.building_exposure)
        if features.building_exposure is not None
        else None
    )

    critical = (
        _clamp(
            features.critical_infrastructure_exposure
        )
        if features.critical_infrastructure_exposure
        is not None
        else None
    )

    weighted_values = []

    if population is not None:
        weighted_values.append(
            (population, 0.30)
        )

        if population >= 0.7:
            factors.append(
                "High population exposure."
            )

    if roads is not None:
        weighted_values.append(
            (roads, 0.20)
        )

        if roads >= 0.7:
            factors.append(
                "High road-network exposure."
            )

    if buildings is not None:
        weighted_values.append(
            (buildings, 0.25)
        )

        if buildings >= 0.7:
            factors.append(
                "High building exposure."
            )

    if critical is not None:
        weighted_values.append(
            (critical, 0.25)
        )

        if critical >= 0.7:
            factors.append(
                "Critical infrastructure exposure detected."
            )

    if not weighted_values:
        return ImpactRisk(
            score=0,
            level="Low",
            confidence=0,
            contributing_factors=[
                "No exposure data available."
            ],
        )

    total_weight = sum(
        weight
        for _, weight in weighted_values
    )

    weighted_score = sum(
        value * weight
        for value, weight in weighted_values
    )

    score = round(
        (weighted_score / total_weight) * 100
    )

    confidence = round(
        features.completeness * 100
    )

    if not factors:
        factors.append(
            "No dominant exposure factor detected."
        )

    return ImpactRisk(
        score=score,
        level=_risk_level(score),
        confidence=confidence,
        contributing_factors=factors,
    )
