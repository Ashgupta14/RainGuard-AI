from .models import LeadWindow
from .config import settings


def estimate_lead_window(
    risk_level: str,
    rainfall: float | None = None,
) -> LeadWindow:

    # ---------------------------------------------------------
    # LOW RISK
    # ---------------------------------------------------------

    if risk_level == "Low":
        return LeadWindow(
            minimum_hours=6.0,
            maximum_hours=6.0,
            midpoint_hours=6.0,
            label=(
                "No immediate threat — "
                "monitoring window up to 6 hr"
            ),
            urgency="Low",
            is_within_target_window=True,
        )

    # ---------------------------------------------------------
    # BASE LEAD WINDOW
    # ---------------------------------------------------------

    if risk_level == "Critical":
        minimum_hours = 2.0
        maximum_hours = 3.0

    elif risk_level == "High":
        minimum_hours = 2.0
        maximum_hours = 4.0

    elif risk_level == "Moderate":
        minimum_hours = 3.0
        maximum_hours = 6.0

    else:
        minimum_hours = 6.0
        maximum_hours = 6.0

    # ---------------------------------------------------------
    # RAINFALL ACCELERATION
    # ---------------------------------------------------------

    if (
        rainfall is not None
        and rainfall >= 40.0
    ):
        minimum_hours = max(
            1.0,
            minimum_hours - 1.0,
        )

    # ---------------------------------------------------------
    # MIDPOINT
    # ---------------------------------------------------------

    midpoint_hours = round(
        (
            minimum_hours +
            maximum_hours
        ) / 2,
        1,
    )

    # ---------------------------------------------------------
    # LABEL
    # ---------------------------------------------------------

    if minimum_hours == maximum_hours:
        label = (
            f"Potential impact within "
            f"~{minimum_hours:g} hr"
        )
    else:
        label = (
            f"Potential impact within "
            f"{minimum_hours:g}–"
            f"{maximum_hours:g} hr"
        )

    return LeadWindow(
        minimum_hours=minimum_hours,
        maximum_hours=maximum_hours,
        midpoint_hours=midpoint_hours,
        label=label,
        urgency=risk_level,
        is_within_target_window=(
            minimum_hours >= settings.lead_window_targets.get("imminent", 2.0)
            and maximum_hours <= settings.lead_window_targets.get("short", 4.0) + 2.0
        ),
    )
