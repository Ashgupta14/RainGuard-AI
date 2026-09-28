def generate_decision_explanation(
    rainfall_trend: str,
    atmospheric_trend: str,
    ground_impact: str,
    future_risk_score: int
) -> str:
    lines = []
    if rainfall_trend == "RISING":
        lines.append("Heavy rainfall is increasing.")
    elif rainfall_trend == "FALLING":
        lines.append("Rainfall is decreasing.")
        
    if atmospheric_trend == "WORSENING":
        lines.append("Atmospheric instability is rising.")
    elif atmospheric_trend == "IMPROVING":
        lines.append("Atmospheric conditions are stabilizing.")
        
    if ground_impact in ["High", "Critical"]:
        lines.append("Low-lying terrain and high exposure increase flood susceptibility.")
        
    if future_risk_score >= 80:
        lines.append("Future risk is escalating rapidly.")
    elif future_risk_score >= 60:
        lines.append("Elevated risk expected over the coming hours.")
        
    if not lines:
        lines.append("Conditions are currently stable with no imminent escalation.")
        
    return " ".join(lines)
