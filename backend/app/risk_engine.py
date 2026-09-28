from typing import List, Optional

from .models import CellRisk


# ---------------------------------------------------------
# RISK LEVEL
# ---------------------------------------------------------

def get_risk_level(score: int) -> str:
    if score >= 80:
        return "Critical"

    if score >= 60:
        return "High"

    if score >= 30:
        return "Moderate"

    return "Low"


# ---------------------------------------------------------
# NORMALIZATION
# ---------------------------------------------------------

def normalize(
    value: float,
    minimum: float,
    maximum: float,
) -> float:

    if maximum <= minimum:
        return 0.0

    normalized = (
        (value - minimum)
        / (maximum - minimum)
    ) * 100.0

    return max(
        0.0,
        min(100.0, normalized),
    )


# ---------------------------------------------------------
# FLOOD RISK ENGINE
# ---------------------------------------------------------

def calculate_flood_risk(
    integrated_water_vapour: Optional[float] = None,
    cape: Optional[float] = None,
    cin: Optional[float] = None,
    wind_convergence: Optional[float] = None,
    wind_shear: Optional[float] = None,
    rainfall: Optional[float] = None,
) -> CellRisk:

    contributing_factors: List[str] = []

    # -----------------------------------------------------
    # 1. IMMEDIATE RAINFALL RISK
    # -----------------------------------------------------

    rainfall_risk = 0.0
    rainfall_available = False

    if rainfall is not None:
        rainfall_available = True

        rainfall_risk = normalize(
            rainfall,
            0.0,
            50.0,
        )

        if rainfall_risk >= 80:
            contributing_factors.append(
                "Very heavy rainfall activity"
            )

        elif rainfall_risk >= 60:
            contributing_factors.append(
                "Heavy rainfall activity"
            )

    # -----------------------------------------------------
    # 2. ATMOSPHERIC ENVIRONMENT
    # -----------------------------------------------------

    atmospheric_components: List[float] = []

    if integrated_water_vapour is not None:

        moisture_risk = normalize(
            integrated_water_vapour,
            20.0,
            70.0,
        )

        atmospheric_components.append(
            moisture_risk
        )

        if moisture_risk >= 60:
            contributing_factors.append(
                "High atmospheric moisture"
            )

    if cape is not None:

        cape_risk = normalize(
            cape,
            0.0,
            2500.0,
        )

        atmospheric_components.append(
            cape_risk
        )

        if cape_risk >= 60:
            contributing_factors.append(
                "Elevated atmospheric instability"
            )

    if cin is not None:

        cin_risk = (
            100.0
            - normalize(
                abs(cin),
                0.0,
                200.0,
            )
        )

        atmospheric_components.append(
            cin_risk
        )

        if cin_risk >= 60:
            contributing_factors.append(
                "Weak convective inhibition"
            )

    atmospheric_available = (
        len(atmospheric_components) > 0
    )

    atmospheric_risk = (
        sum(atmospheric_components)
        / len(atmospheric_components)
        if atmospheric_available
        else 0.0
    )

    # -----------------------------------------------------
    # 3. KINEMATIC SUPPORT
    # -----------------------------------------------------

    kinematic_components: List[float] = []

    if wind_convergence is not None:

        convergence_risk = normalize(
            abs(wind_convergence),
            0.0,
            20.0,
        )

        kinematic_components.append(
            convergence_risk
        )

        if convergence_risk >= 60:
            contributing_factors.append(
                "Strong wind convergence"
            )

    if wind_shear is not None:

        shear_risk = normalize(
            wind_shear,
            0.0,
            30.0,
        )

        kinematic_components.append(
            shear_risk
        )

        if shear_risk >= 60:
            contributing_factors.append(
                "Elevated wind shear"
            )

    kinematics_available = (
        len(kinematic_components) > 0
    )

    kinematic_risk = (
        sum(kinematic_components)
        / len(kinematic_components)
        if kinematics_available
        else 0.0
    )

    # -----------------------------------------------------
    # 4. DYNAMIC WEIGHTING
    # -----------------------------------------------------

    weighted_score = 0.0
    total_weight = 0.0

    if rainfall_available:
        weighted_score += (
            rainfall_risk * 0.50
        )
        total_weight += 0.50

    if atmospheric_available:
        weighted_score += (
            atmospheric_risk * 0.30
        )
        total_weight += 0.30

    if kinematics_available:
        weighted_score += (
            kinematic_risk * 0.20
        )
        total_weight += 0.20

    if total_weight > 0:
        score = (
            weighted_score /
            total_weight
        )
    else:
        score = 0.0

    rounded_score = round(
        max(
            0.0,
            min(100.0, score),
        )
    )

    # -----------------------------------------------------
    # 5. LEVEL
    # -----------------------------------------------------

    level = get_risk_level(
        rounded_score
    )

    # -----------------------------------------------------
    # 6. FEATURE COMPLETENESS
    # -----------------------------------------------------

    feature_values = [
        integrated_water_vapour,
        cape,
        cin,
        wind_convergence,
        wind_shear,
        rainfall,
    ]

    available_features = sum(
        value is not None
        for value in feature_values
    )

    feature_completeness = (
        available_features /
        len(feature_values)
    )

    # -----------------------------------------------------
    # 7. RELIABILITY
    # -----------------------------------------------------

    is_reliable = (
        feature_completeness >= 0.5
    )

    # -----------------------------------------------------
    # 8. FALLBACK EXPLANATION
    # -----------------------------------------------------

    if (
        not contributing_factors
        and rounded_score < 30
    ):
        contributing_factors.append(
            "No major atmospheric risk drivers detected"
        )

    return CellRisk(
        score=rounded_score,

        level=level,

        contributing_factors=
            contributing_factors,

        feature_completeness=round(
            feature_completeness,
            2,
        ),

        is_reliable=is_reliable,
    )
