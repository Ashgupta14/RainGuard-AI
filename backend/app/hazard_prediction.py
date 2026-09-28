from typing import List, Optional

from .models import HazardPrediction


# ---------------------------------------------------------
# LEVEL
# ---------------------------------------------------------

def get_level(score: int) -> str:

    if score >= 80:
        return "Critical"

    if score >= 60:
        return "High"

    if score >= 30:
        return "Moderate"

    return "Low"


# ---------------------------------------------------------
# CONFIDENCE
# ---------------------------------------------------------

def calculate_confidence(
    feature_completeness: float,
) -> int:

    return round(
        max(
            0.0,
            min(
                100.0,
                feature_completeness * 100,
            ),
        )
    )


# ---------------------------------------------------------
# HEAVY RAIN
# ---------------------------------------------------------

def calculate_heavy_rain_score(
    rainfall: Optional[float],
    integrated_water_vapour: Optional[float],
) -> int:

    rainfall_score = 0.0

    if rainfall is not None:
        rainfall_score = min(
            100.0,
            (rainfall / 50.0) * 100.0,
        )

    moisture_score = 0.0

    if integrated_water_vapour is not None:
        moisture_score = min(
            100.0,
            (
                integrated_water_vapour
                / 70.0
            ) * 100.0,
        )

    return round(
        rainfall_score * 0.75
        + moisture_score * 0.25
    )


# ---------------------------------------------------------
# FLASH FLOOD
# ---------------------------------------------------------

def calculate_flash_flood_score(
    rainfall: Optional[float],
    integrated_water_vapour: Optional[float],
    wind_convergence: Optional[float],
) -> int:

    rainfall_score = 0.0

    if rainfall is not None:
        rainfall_score = min(
            100.0,
            (rainfall / 50.0) * 100.0,
        )

    moisture_score = 0.0

    if integrated_water_vapour is not None:
        moisture_score = min(
            100.0,
            (
                integrated_water_vapour
                / 70.0
            ) * 100.0,
        )

    convergence_score = 0.0

    if wind_convergence is not None:
        convergence_score = min(
            100.0,
            (
                abs(wind_convergence)
                / 20.0
            ) * 100.0,
        )

    return round(
        rainfall_score * 0.55
        + moisture_score * 0.25
        + convergence_score * 0.20
    )


# ---------------------------------------------------------
# SEVERE WEATHER
# ---------------------------------------------------------

def calculate_severe_weather_score(
    cape: Optional[float],
    cin: Optional[float],
    wind_convergence: Optional[float],
    wind_shear: Optional[float],
) -> int:

    cape_score = 0.0

    if cape is not None:
        cape_score = min(
            100.0,
            (cape / 2500.0) * 100.0,
        )

    cin_score = 0.0

    if cin is not None:
        cin_score = max(
            0.0,
            min(
                100.0,
                100.0
                - (
                    abs(cin)
                    / 200.0
                ) * 100.0,
            ),
        )

    convergence_score = 0.0

    if wind_convergence is not None:
        convergence_score = min(
            100.0,
            (
                abs(wind_convergence)
                / 20.0
            ) * 100.0,
        )

    shear_score = 0.0

    if wind_shear is not None:
        shear_score = min(
            100.0,
            (wind_shear / 30.0)
            * 100.0,
        )

    return round(
        cape_score * 0.35
        + cin_score * 0.15
        + convergence_score * 0.20
        + shear_score * 0.30
    )


# ---------------------------------------------------------
# REASON
# ---------------------------------------------------------

def create_reason(
    hazard: str,
    score: int,
) -> str:

    if score < 30:

        return (
            f"{hazard} indicators "
            "remain limited."
        )


    if score < 60:

        return (
            f"{hazard} indicators are "
            "increasing and require "
            "monitoring."
        )


    if score < 80:

        return (
            f"{hazard} indicators show "
            "elevated atmospheric risk."
        )


    return (
        f"{hazard} indicators show "
        "a significant atmospheric threat."
    )


# ---------------------------------------------------------
# MULTI-HAZARD PREDICTION
# ---------------------------------------------------------

def predict_hazards(
    integrated_water_vapour:
        Optional[float] = None,

    cape:
        Optional[float] = None,

    cin:
        Optional[float] = None,

    wind_convergence:
        Optional[float] = None,

    wind_shear:
        Optional[float] = None,

    rainfall:
        Optional[float] = None,

    feature_completeness:
        float = 0.0,
) -> List[HazardPrediction]:

    confidence = (
        calculate_confidence(
            feature_completeness
        )
    )


    # -----------------------------------------------------
    # SCORES
    # -----------------------------------------------------

    heavy_rain_score = (
        calculate_heavy_rain_score(
            rainfall,
            integrated_water_vapour,
        )
    )


    flash_flood_score = (
        calculate_flash_flood_score(
            rainfall,
            integrated_water_vapour,
            wind_convergence,
        )
    )


    severe_weather_score = (
        calculate_severe_weather_score(
            cape,
            cin,
            wind_convergence,
            wind_shear,
        )
    )


    # -----------------------------------------------------
    # RESULTS
    # -----------------------------------------------------

    return [

        HazardPrediction(

            type="Heavy Rain",

            score=heavy_rain_score,

            level=get_level(
                heavy_rain_score
            ),

            confidence=confidence,

            reason=create_reason(
                "Heavy Rain",
                heavy_rain_score,
            ),
        ),


        HazardPrediction(

            type="Flash Flood",

            score=flash_flood_score,

            level=get_level(
                flash_flood_score
            ),

            confidence=confidence,

            reason=create_reason(
                "Flash Flood",
                flash_flood_score,
            ),
        ),


        HazardPrediction(

            type="Severe Weather",

            score=severe_weather_score,

            level=get_level(
                severe_weather_score
            ),

            confidence=confidence,

            reason=create_reason(
                "Severe Weather",
                severe_weather_score,
            ),
        ),
    ]
