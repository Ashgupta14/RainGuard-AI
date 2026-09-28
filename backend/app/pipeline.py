from datetime import datetime, timezone
from typing import List

from .demo_data import create_demo_grid

from .grid import (
    build_grid_intelligence,
    GRID_ROWS,
    GRID_COLUMNS,
)

from .models import (
    GridCellIntelligence,
    GridRiskSummary,
    RainGuardAlert,
)

from .alert_engine import create_alert


# ---------------------------------------------------------
# GRID RISK SUMMARY
# ---------------------------------------------------------

def calculate_grid_summary(
    cells: List[GridCellIntelligence],
) -> GridRiskSummary:

    total_cells = len(cells)

    if total_cells == 0:
        return GridRiskSummary(
            average_risk_score=0,
            maximum_risk_score=0,
            highest_risk_level="Low",
            high_risk_cells=0,
            critical_risk_cells=0,
            populated_cells=0,
            total_cells=0,
            coverage_percent=0.0,
            reliable_cells=0,
            reliable_coverage_percent=0.0,
        )

    scores = [
        cell.risk.score
        for cell in cells
    ]

    average_risk_score = round(
        sum(scores) / len(scores)
    )

    maximum_risk_score = max(scores)

    highest_risk_cell = max(
        cells,
        key=lambda cell: cell.risk.score,
    )

    highest_risk_level = (
        highest_risk_cell
        .risk
        .level
    )

    high_risk_cells = sum(
        cell.risk.level
        in ["High", "Critical"]
        for cell in cells
    )

    critical_risk_cells = sum(
        cell.risk.level
        == "Critical"
        for cell in cells
    )

    populated_cells = sum(
        cell.cell.observation_count > 0
        for cell in cells
    )

    coverage_percent = (
        populated_cells /
        total_cells
    ) * 100

    reliable_cells = sum(
        cell.risk.is_reliable
        for cell in cells
    )

    reliable_coverage_percent = (
        reliable_cells /
        total_cells
    ) * 100

    return GridRiskSummary(
        average_risk_score=
            average_risk_score,

        maximum_risk_score=
            maximum_risk_score,

        highest_risk_level=
            highest_risk_level,

        high_risk_cells=
            high_risk_cells,

        critical_risk_cells=
            critical_risk_cells,

        populated_cells=
            populated_cells,

        total_cells=
            total_cells,

        coverage_percent=
            round(
                coverage_percent,
                1,
            ),

        reliable_cells=
            reliable_cells,

        reliable_coverage_percent=
            round(
                reliable_coverage_percent,
                1,
            ),
    )


# ---------------------------------------------------------
# ACTIVE ALERTS
# ---------------------------------------------------------

def generate_active_alerts(
    cells: List[GridCellIntelligence],
) -> List[RainGuardAlert]:

    alerts: List[RainGuardAlert] = []

    for cell in cells:

        risk = cell.risk

        if risk.level not in [
            "High",
            "Critical",
        ]:
            continue

        # -----------------------------------------------
        # Determine dominant hazard
        # -----------------------------------------------

        if not cell.hazards:

            hazard = "Severe Weather"

        else:

            dominant_hazard = max(
                cell.hazards,
                key=lambda item:
                    item.score,
            )

            hazard = (
                dominant_hazard
                .type
            )


        # -----------------------------------------------
        # Create alert
        # -----------------------------------------------

        alert = create_alert(
            cell_id=
                cell.cell.id,

            hazard=
                hazard,

            risk_score=
                risk.score,

            risk_level=
                risk.level,

            rainfall=
                cell.cell.rainfall,

            confidence=
                round(
                    risk.feature_completeness
                    * 100
                ),

            contributing_factors=
                risk.contributing_factors,
        )

        alerts.append(alert)


    return alerts


# ---------------------------------------------------------
# COMPLETE DEMO PIPELINE
# ---------------------------------------------------------

def run_demo_pipeline():
    """
    Execute the complete RainGuard
    demonstration intelligence pipeline.
    """

    # -----------------------------------------------------
    # STEP 1 — DATA
    # -----------------------------------------------------

    grid_cells = (
        create_demo_grid()
    )


    # -----------------------------------------------------
    # STEP 2 — INTELLIGENCE
    # -----------------------------------------------------

    intelligent_cells = (
        build_grid_intelligence(
            grid_cells
        )
    )


    # -----------------------------------------------------
    # STEP 3 — RISK SUMMARY
    # -----------------------------------------------------

    summary = (
        calculate_grid_summary(
            intelligent_cells
        )
    )


    # -----------------------------------------------------
    # STEP 4 — ACTIVE ALERTS
    # -----------------------------------------------------

    alerts = (
        generate_active_alerts(
            intelligent_cells
        )
    )


    # -----------------------------------------------------
    # STEP 5 — TIMESTAMP
    # -----------------------------------------------------

    generated_at = (
        datetime.now(
            timezone.utc
        ).isoformat()
    )


    return {
        "grid_rows":
            GRID_ROWS,

        "grid_columns":
            GRID_COLUMNS,

        "cells":
            intelligent_cells,

        "summary":
            summary,

        "alerts":
            alerts,

        "generated_at":
            generated_at,
    }
