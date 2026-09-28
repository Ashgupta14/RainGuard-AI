from datetime import datetime, timezone
from typing import Optional

from .models import (
    RainGuardAlert,
    TimeToImpact,
    LeadWindow,
)

from .lead_window import (
    estimate_lead_window,
)

from .hazard_prediction import (
    get_level,
)


# ---------------------------------------------------------
# ALERT SEVERITY
# ---------------------------------------------------------

def get_alert_severity(
    risk_level: str,
) -> str:

    if risk_level == "Critical":
        return "Emergency"

    if risk_level == "High":
        return "Warning"

    if risk_level == "Moderate":
        return "Watch"

    return "Advisory"


# ---------------------------------------------------------
# TIME TO IMPACT
# ---------------------------------------------------------

def estimate_time_to_impact(
    risk_score: int,
    rainfall: Optional[float] = None,
) -> TimeToImpact:

    # -----------------------------------------------------
    # LOW RISK
    # -----------------------------------------------------

    if risk_score < 30:

        return TimeToImpact(

            estimated_minutes=None,

            estimated_hours=None,

            window_label=
                "No immediate flood threat",

            urgency="Low",

            is_estimate=True,
        )


    # -----------------------------------------------------
    # BASE ESTIMATE
    # -----------------------------------------------------

    if risk_score >= 80:

        estimated_minutes = 45

    elif risk_score >= 60:

        estimated_minutes = 90

    else:

        estimated_minutes = 180


    # -----------------------------------------------------
    # RAINFALL ACCELERATION
    # -----------------------------------------------------

    if (
        rainfall is not None
        and rainfall >= 40
    ):

        estimated_minutes -= 15


    estimated_minutes = max(
        15,
        estimated_minutes,
    )


    # -----------------------------------------------------
    # HOURS
    # -----------------------------------------------------

    estimated_hours = round(
        estimated_minutes / 60,
        1,
    )


    # -----------------------------------------------------
    # WINDOW LABEL
    # -----------------------------------------------------

    if estimated_minutes < 60:

        window_label = (
            f"Potential impact in "
            f"~{estimated_minutes} min"
        )

    else:

        window_label = (
            f"Potential impact in "
            f"~{estimated_hours} hr"
        )


    # -----------------------------------------------------
    # RESULT
    # -----------------------------------------------------

    return TimeToImpact(

        estimated_minutes=
            estimated_minutes,

        estimated_hours=
            estimated_hours,

        window_label=
            window_label,

        urgency=
            get_level(
                risk_score
            ),

        is_estimate=True,
    )


# ---------------------------------------------------------
# ACTION
# ---------------------------------------------------------

def get_recommended_action(
    severity: str,
    hazard: str,
) -> str:

    hazard_text = (
        hazard.lower()
    )


    if severity == "Emergency":

        return (
            "Avoid exposed and low-lying "
            "areas. Follow official "
            "emergency instructions for "
            f"{hazard_text}."
        )


    if severity == "Warning":

        return (
            "Prepare for possible "
            f"{hazard_text} impacts and "
            "avoid unnecessary travel "
            "through vulnerable areas."
        )


    if severity == "Watch":

        return (
            "Monitor conditions closely "
            "and be prepared to move to "
            "a safer location if risk "
            "increases."
        )


    return (
        "Continue monitoring local "
        "weather and RainGuard risk "
        "updates."
    )


# ---------------------------------------------------------
# HEADLINE
# ---------------------------------------------------------

def create_headline(
    severity: str,
    hazard: str,
) -> str:

    if severity == "Emergency":

        return (
            f"Emergency: "
            f"{hazard} Risk"
        )


    if severity == "Warning":

        return (
            f"Warning: "
            f"{hazard} Risk"
        )


    if severity == "Watch":

        return (
            f"Watch: "
            f"{hazard} Conditions"
        )


    return (
        f"Advisory: "
        f"{hazard} Conditions"
    )


# ---------------------------------------------------------
# ALERT CREATION
# ---------------------------------------------------------

def create_alert(
    cell_id: str,
    hazard: str,
    risk_score: int,
    risk_level: str,
    rainfall: Optional[float] = None,
    confidence: int = 0,
    contributing_factors: Optional[
        list[str]
    ] = None,
) -> RainGuardAlert:

    severity = (
        get_alert_severity(
            risk_level
        )
    )


    time_to_impact = (
        estimate_time_to_impact(
            risk_score,
            rainfall,
        )
    )


    lead_window = (
        estimate_lead_window(
            risk_level,
            rainfall,
        )
    )


    headline = (
        create_headline(
            severity,
            hazard,
        )
    )


    factor_text = ""

    if contributing_factors:
        factor_text = (
            " Key drivers: "
            + ", ".join(
                contributing_factors
            )
            + "."
        )

    message = (
        f"{hazard} indicators are "
        f"elevated in grid cell "
        f"{cell_id}. "
        f"Current risk score is "
        f"{risk_score}/100. "
        f"{lead_window.label}. "
        f"{time_to_impact.window_label}."
        f"{factor_text}"
    )


    action = (
        get_recommended_action(
            severity,
            hazard,
        )
    )


    generated_at = (
        datetime.now(
            timezone.utc
        ).isoformat()
    )


    return RainGuardAlert(

        id=(
            f"RG-{cell_id}-"
            f"{int(datetime.now().timestamp())}"
        ),

        cell_id=
            cell_id,

        hazard=
            hazard,

        severity=
            severity,

        risk_score=
            risk_score,

        headline=
            headline,

        message=
            message,

        action=
            action,

        time_to_impact=
            time_to_impact,

        lead_window=
            lead_window,

        confidence=
            confidence,

        generated_at=
            generated_at,
    )
