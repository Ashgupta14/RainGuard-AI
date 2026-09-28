from pydantic import BaseModel

class TimeToImpact(BaseModel):
    estimated_hours: int
    window_description: str
    is_urgent: bool

def calculate_time_to_impact(
    current_risk_score: int,
    future_risk_score: int,
    rainfall_trend: str,
    atmospheric_trend: str,
    severity: str
) -> TimeToImpact:
    is_urgent = False
    
    if (current_risk_score >= 80 or future_risk_score >= 85) and rainfall_trend == "RISING":
        estimated_hours = 1
        is_urgent = True
    elif severity == "Critical" and atmospheric_trend == "WORSENING":
        estimated_hours = 2
        is_urgent = True
    elif future_risk_score >= 60:
        estimated_hours = 4
    else:
        estimated_hours = 6
        
    if is_urgent:
        window_desc = f"Urgent: Impact expected within {estimated_hours} hour(s)."
    else:
        window_desc = f"Standard target: {max(2, estimated_hours-2)}-{estimated_hours+2} hours."

    return TimeToImpact(
        estimated_hours=estimated_hours,
        window_description=window_desc,
        is_urgent=is_urgent
    )
