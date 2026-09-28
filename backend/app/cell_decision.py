from dataclasses import dataclass
from .unified_cell_intelligence import UnifiedCellIntelligence
from .impact_priority import determine_priority
from .action_recommendations import get_action_recommendations
from .explainability import generate_explanation

@dataclass
class CellDecision:
    priority: str
    severity: str
    confidence: int
    headline: str
    explanation: str
    contributing_factors: list[str]
    recommended_actions: list[str]
    escalation_required: bool

def build_cell_decision(cell_intel: UnifiedCellIntelligence) -> CellDecision:
    impact = cell_intel.ground_impact
    priority = determine_priority(impact.ground_impact_score)
    actions = get_action_recommendations(priority)
    explanation = generate_explanation(impact)
    
    escalation_required = priority in ["PREPARE", "URGENT ACTION"]
    
    headline = f"{priority} — Monitor localized conditions"
    if priority == "URGENT ACTION":
        headline = "URGENT ACTION — Prepare for localized flooding"
    elif priority == "PREPARE":
        headline = "PREPARE — Elevated risk conditions"

    return CellDecision(
        priority=priority,
        severity=impact.level,
        confidence=impact.confidence,
        headline=headline,
        explanation=explanation,
        contributing_factors=impact.contributing_factors,
        recommended_actions=actions,
        escalation_required=escalation_required
    )
