from dataclasses import dataclass

from .terrain import TerrainFeatures


@dataclass
class TerrainRiskFactors:
    elevation_factor: float
    slope_factor: float
    drainage_factor: float
    flow_accumulation_factor: float

    terrain_score: int
    explanation: list[str]


def _clamp(value: float) -> float:
    return max(0.0, min(value, 1.0))


def calculate_terrain_factors(
    terrain: TerrainFeatures,
) -> TerrainRiskFactors:

    elevation_factor = 0.0
    slope_factor = 0.0
    drainage_factor = 0.0
    flow_accumulation_factor = 0.0

    explanation: list[str] = []

    if terrain.elevation_m is not None:
        if terrain.elevation_m <= 10:
            elevation_factor = 1.0
            explanation.append(
                "Very low elevation may increase flood exposure."
            )
        elif terrain.elevation_m <= 25:
            elevation_factor = 0.7
            explanation.append(
                "Low elevation may increase flood exposure."
            )
        elif terrain.elevation_m <= 50:
            elevation_factor = 0.4

    if terrain.slope_degrees is not None:
        if terrain.slope_degrees <= 2:
            slope_factor = 0.9
            explanation.append(
                "Very gentle terrain may slow surface drainage."
            )
        elif terrain.slope_degrees <= 5:
            slope_factor = 0.6
        elif terrain.slope_degrees <= 10:
            slope_factor = 0.3

    if terrain.drainage_score is not None:
        drainage_factor = _clamp(
            1.0 - terrain.drainage_score
        )

        if drainage_factor >= 0.7:
            explanation.append(
                "Limited drainage capacity may increase local flood exposure."
            )

    if terrain.flow_accumulation_proxy is not None:
        flow_accumulation_factor = _clamp(
            terrain.flow_accumulation_proxy
        )

        if flow_accumulation_factor >= 0.7:
            explanation.append(
                "High flow-accumulation potential may concentrate surface water."
            )

    weighted_score = (
        elevation_factor * 0.30
        + slope_factor * 0.20
        + drainage_factor * 0.25
        + flow_accumulation_factor * 0.25
    )

    terrain_score = round(
        weighted_score * 100
    )

    return TerrainRiskFactors(
        elevation_factor=round(elevation_factor, 3),
        slope_factor=round(slope_factor, 3),
        drainage_factor=round(drainage_factor, 3),
        flow_accumulation_factor=round(
            flow_accumulation_factor,
            3,
        ),
        terrain_score=terrain_score,
        explanation=explanation,
    )
