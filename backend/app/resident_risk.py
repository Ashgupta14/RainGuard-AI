from .resident_api_models import ResidentRiskSummary
from .models import GridCellIntelligence

def generate_resident_risk(cell: GridCellIntelligence) -> ResidentRiskSummary:
    impact = cell.decision.impact_projection.get("projection", "No immediate impact") if isinstance(cell.decision.impact_projection, dict) else "No immediate impact"
    time_to_impact = cell.time_to_impact.window if cell.time_to_impact else "N/A"
    
    priority = cell.decision.priority
    if priority in ["URGENT", "RESPOND"]:
        what_to_do = "Avoid low-lying roads and monitor official warnings immediately."
    elif priority == "PREPARE":
        what_to_do = "Prepare for potential disruptions and stay updated."
    elif priority == "WATCH":
        what_to_do = "Monitor local conditions."
    else:
        what_to_do = "No special action required. Continue normal activities."

    return ResidentRiskSummary(
        risk_level=cell.overall_level,
        risk_score=cell.overall_risk_score,
        potential_impact=impact,
        time_to_impact=time_to_impact,
        confidence=cell.confidence or 0,
        what_to_do=what_to_do,
        disclaimer="Prototype decision support — not an authoritative emergency warning."
    )
