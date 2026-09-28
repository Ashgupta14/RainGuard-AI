from dataclasses import dataclass

from .impact_risk import ImpactRisk
from .terrain_factors import TerrainRiskFactors


@dataclass
class GroundImpactIntelligence:
    atmospheric_risk_score: int
    terrain_score: int
    exposure_score: int

    ground_impact_score: int
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


def build_ground_impact_intelligence(
    atmospheric_risk_score: int,
    terrain: TerrainRiskFactors,
    impact: ImpactRisk,
) -> GroundImpactIntelligence:

    atmospheric = max(
        0,
        min(atmospheric_risk_score, 100),
    )

    terrain_score = max(
        0,
        min(terrain.terrain_score, 100),
    )

    exposure_score = max(
        0,
        min(impact.score, 100),
    )

    ground_impact_score = round(
        atmospheric * 0.50
        + terrain_score * 0.20
        + exposure_score * 0.30
    )

    confidence = round(
        (
            terrain_score > 0
            and impact.confidence > 0
        )
        * min(
            impact.confidence,
            100,
        )
    )

    contributing_factors = []

    if atmospheric >= 60:
        contributing_factors.append(
            "Atmospheric hazard conditions are elevated."
        )

    if terrain_score >= 60:
        contributing_factors.extend(
            terrain.explanation
        )

    if exposure_score >= 60:
        contributing_factors.extend(
            impact.contributing_factors
        )

    if not contributing_factors:
        contributing_factors.append(
            "No dominant ground-impact factor detected."
        )

    return GroundImpactIntelligence(
        atmospheric_risk_score=atmospheric,
        terrain_score=terrain_score,
        exposure_score=exposure_score,
        ground_impact_score=ground_impact_score,
        level=_risk_level(
            ground_impact_score
        ),
        confidence=confidence,
        contributing_factors=contributing_factors,
    )
