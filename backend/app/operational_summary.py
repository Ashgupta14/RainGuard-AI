from typing import List
from .models import GridCellIntelligence, OperationalSummary
from .incident_store import incident_store

def generate_operational_summary(cells: List[GridCellIntelligence]) -> OperationalSummary:
    critical_cells = 0
    high_risk_cells = 0
    urgent_cells = 0
    worsening_cells = 0
    highest_risk_score = 0
    highest_risk_location = {}
    hazard_counts = {}
    most_urgent_minutes = float('inf')
    most_urgent_label = "None"
    
    for c in cells:
        if c.overall_level == "Critical":
            critical_cells += 1
        elif c.overall_level == "High":
            high_risk_cells += 1
            
        if c.time_to_impact and "Urgent" in c.time_to_impact.window_label:
            urgent_cells += 1
            if c.time_to_impact.estimated_minutes and c.time_to_impact.estimated_minutes < most_urgent_minutes:
                most_urgent_minutes = c.time_to_impact.estimated_minutes
                most_urgent_label = c.time_to_impact.window_label
                
        if c.nowcasting and c.nowcasting.rainfall.trend == "RISING":
            worsening_cells += 1
            
        if c.overall_risk_score > highest_risk_score:
            highest_risk_score = c.overall_risk_score
            highest_risk_location = {"latitude": c.cell.latitude, "longitude": c.cell.longitude}
            
        if c.hazards:
            for h in c.hazards:
                hazard_counts[h.type] = hazard_counts.get(h.type, 0) + 1
                
    dominant_hazard = max(hazard_counts, key=hazard_counts.get) if hazard_counts else "None"
    
    active_incidents = len([i for i in incident_store.list_incidents() if i.status in ["OPEN", "MONITORING"]])
    
    return OperationalSummary(
        active_incidents=active_incidents,
        critical_cells=critical_cells,
        high_risk_cells=high_risk_cells,
        urgent_cells=urgent_cells,
        worsening_cells=worsening_cells,
        highest_risk_location=highest_risk_location,
        dominant_hazard=dominant_hazard,
        most_urgent_time_to_impact=most_urgent_label
    )
