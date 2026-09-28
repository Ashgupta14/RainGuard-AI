from typing import Any


def build_demo_scenario(
    pipeline_result: dict[str, Any],
) -> dict[str, Any]:
    cells = pipeline_result.get("cells", [])
    alerts = pipeline_result.get("alerts", [])

    if not cells:
        return {
            "scenario": "severe_weather_response",
            "status": "no_data",
            "headline": "No intelligence cells available",
            "steps": [],
        }

    highest_risk_cell = max(
        cells,
        key=lambda item: item.risk.score,
    )

    dominant_hazard = "Severe Weather"

    if highest_risk_cell.hazards:
        dominant_hazard = max(
            highest_risk_cell.hazards,
            key=lambda item: item.score,
        ).type

    steps = [
        {
            "stage": "Observe",
            "description": (
                "Atmospheric and rainfall observations "
                "enter the intelligence pipeline."
            ),
        },
        {
            "stage": "Analyze",
            "description": (
                "Atmospheric features are converted into "
                "cell-level intelligence."
            ),
        },
        {
            "stage": "Assess",
            "description": (
                f"Highest-risk cell is "
                f"{highest_risk_cell.cell.id} with a "
                f"risk score of "
                f"{highest_risk_cell.risk.score}/100."
            ),
        },
        {
            "stage": "Predict",
            "description": (
                f"Dominant hazard identified as "
                f"{dominant_hazard}."
            ),
        },
        {
            "stage": "Alert",
            "description": (
                f"{len(alerts)} active high/critical "
                f"alerts generated."
            ),
        },
        {
            "stage": "Act",
            "description": (
                "Warnings provide a lead window and "
                "recommended action for decision-makers."
            ),
        },
    ]

    return {
        "scenario": "severe_weather_response",
        "status": "ready",
        "headline": (
            "From atmospheric signals to actionable warning"
        ),
        "highest_risk_cell": highest_risk_cell.cell.id,
        "highest_risk_score": highest_risk_cell.risk.score,
        "dominant_hazard": dominant_hazard,
        "active_alerts": len(alerts),
        "steps": steps,
    }
