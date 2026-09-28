def determine_priority(ground_impact_score: int) -> str:
    if ground_impact_score >= 80:
        return "URGENT ACTION"
    elif ground_impact_score >= 60:
        return "PREPARE"
    elif ground_impact_score >= 30:
        return "WATCH"
    return "MONITOR"
