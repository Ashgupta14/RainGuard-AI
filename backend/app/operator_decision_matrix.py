def determine_operator_priority(
    current_risk_score: int,
    future_risk_score: int,
    ground_impact_score: int,
    is_urgent: bool
) -> str:
    combined_score = current_risk_score * 0.3 + future_risk_score * 0.4 + ground_impact_score * 0.3
    
    if is_urgent and combined_score >= 80:
        return "URGENT"
    elif combined_score >= 75:
        return "RESPOND"
    elif combined_score >= 60:
        return "PREPARE"
    elif combined_score >= 40:
        return "WATCH"
    else:
        return "MONITOR"
