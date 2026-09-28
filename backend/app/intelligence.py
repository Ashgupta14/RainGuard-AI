from typing import Optional

from .models import (
    GridCell,
    GridCellIntelligence,
)

from .risk_engine import (
    calculate_flood_risk,
)

from .hazard_prediction import (
    predict_hazards,
)


# ---------------------------------------------------------
# CELL INTELLIGENCE
# ---------------------------------------------------------

def build_cell_intelligence(
    cell: GridCell,
) -> GridCellIntelligence:
    """
    Convert atmospheric observations from one grid cell
    into RainGuard risk and multi-hazard intelligence.
    """

    # -----------------------------------------------------
    # RISK ENGINE
    # -----------------------------------------------------

    risk = calculate_flood_risk(
        integrated_water_vapour=
            cell.integrated_water_vapour,

        cape=
            cell.cape,

        cin=
            cell.cin,

        wind_convergence=
            cell.wind_convergence,

        wind_shear=
            cell.wind_shear,

        rainfall=
            cell.rainfall,
    )


    # -----------------------------------------------------
    # HAZARD ENGINE
    # -----------------------------------------------------

    hazards = predict_hazards(
        integrated_water_vapour=
            cell.integrated_water_vapour,

        cape=
            cell.cape,

        wind_convergence=
            cell.wind_convergence,

        wind_shear=
            cell.wind_shear,

        rainfall=
            cell.rainfall,

        feature_completeness=
            risk.feature_completeness,
    )


    # -----------------------------------------------------
    # OVERALL HAZARD SCORE
    # -----------------------------------------------------

    hazard_scores = [
        hazard.score
        for hazard in hazards
    ]

    overall_risk_score = max(
        [risk.score] +
        hazard_scores
    )


    # -----------------------------------------------------
    # OVERALL LEVEL
    # -----------------------------------------------------

    if overall_risk_score >= 80:

        overall_level = "Critical"

    elif overall_risk_score >= 60:

        overall_level = "High"

    elif overall_risk_score >= 30:

        overall_level = "Moderate"

    else:

        overall_level = "Low"


    # -----------------------------------------------------
    # RESULT
    # -----------------------------------------------------

    return GridCellIntelligence(

        cell=cell,

        risk=risk,

        hazards=hazards,

        overall_risk_score=
            overall_risk_score,

        overall_level=
            overall_level,
    )
