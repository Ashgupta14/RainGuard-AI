from pydantic import BaseModel
from .models import GridCellIntelligence

class WhatIfComparison(BaseModel):
    risk_change: str
    level_change: str
    ground_impact_change: str
    future_risk_change: str
    priority_change: str
    recommended_response: str

def compare_what_if_scenario(current: GridCellIntelligence, scenario: GridCellIntelligence) -> WhatIfComparison:
    risk_change = f"{current.overall_risk_score} -> {scenario.overall_risk_score}"
    level_change = f"{current.overall_level} -> {scenario.overall_level}"
    
    current_ground = current.ground_impact.score if current.ground_impact else 0
    scenario_ground = scenario.ground_impact.score if scenario.ground_impact else 0
    ground_change = f"{current_ground} -> {scenario_ground}"
    
    current_fr = current.future_risk.score if current.future_risk else 0
    scenario_fr = scenario.future_risk.score if scenario.future_risk else 0
    fr_change = f"{current_fr} -> {scenario_fr}"
    
    current_priority = current.decision.priority if current.decision else "None"
    scenario_priority = scenario.decision.priority if scenario.decision else "None"
    priority_change = f"{current_priority} -> {scenario_priority}"
    
    recommended = scenario.decision.explanation if scenario.decision else ""
    
    return WhatIfComparison(
        risk_change=risk_change,
        level_change=level_change,
        ground_impact_change=ground_change,
        future_risk_change=fr_change,
        priority_change=priority_change,
        recommended_response=recommended
    )
