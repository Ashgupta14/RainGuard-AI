def get_action_recommendations(priority: str, primary_hazard: str = "Flood risk") -> list[str]:
    actions = []
    
    if priority in ["URGENT", "RESPOND", "URGENT ACTION"]:
        if primary_hazard == "Flood risk":
            actions.extend([
                "Review drainage",
                "Prepare pumping resources",
                "Monitor low-lying areas"
            ])
        elif primary_hazard == "Severe weather":
            actions.extend([
                "Increase monitoring",
                "Prepare emergency teams",
                "Issue local warnings"
            ])
        elif primary_hazard == "High road exposure":
            actions.extend([
                "Monitor vulnerable road segments",
                "Prepare traffic-control measures"
            ])
        else:
            actions.extend([
                "Issue local warning",
                "Alert emergency-response teams"
            ])
    elif priority == "PREPARE":
        actions.extend([
            "Increase monitoring",
            "Verify rainfall and drainage conditions",
            "Prepare response resources"
        ])
    elif priority == "WATCH":
        actions.extend([
            "Continue routine monitoring",
            "Review local drainage"
        ])
    else:
        actions.extend([
            "Continue routine monitoring"
        ])
        
    return actions
