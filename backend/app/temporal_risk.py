from dataclasses import dataclass

from .trend_engine import (
    AtmosphericTrend,
)


@dataclass
class TemporalRiskSignal:
    score: int
    level: str
    contributing_signals: list[str]


def calculate_temporal_risk(
    trend: AtmosphericTrend,
) -> TemporalRiskSignal:

    score = 0
    signals: list[str] = []

    if trend.rainfall_trend == "rising":
        score += 35
        signals.append(
            "Rainfall intensity is increasing."
        )

    if trend.instability_trend == "rising":
        score += 25
        signals.append(
            "Atmospheric instability is increasing."
        )

    if trend.moisture_trend == "rising":
        score += 15
        signals.append(
            "Moisture availability is increasing."
        )

    if trend.pressure_trend == "falling":
        score += 10
        signals.append(
            "Surface pressure is falling."
        )

    if trend.wind_trend == "rising":
        score += 15
        signals.append(
            "Wind intensity is increasing."
        )

    score = min(
        score,
        100,
    )

    if score >= 80:
        level = "Critical"
    elif score >= 60:
        level = "High"
    elif score >= 30:
        level = "Moderate"
    else:
        level = "Low"

    return TemporalRiskSignal(
        score=score,
        level=level,
        contributing_signals=signals,
    )
