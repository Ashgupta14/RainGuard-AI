from pydantic import BaseModel
from typing import List
from .future_risk import FutureRisk
from .future_risk_decision import FutureAwareDecision
from .alert_escalation import EscalationStatus
from .action_recommendations import get_action_recommendations

class FutureAlertContent(BaseModel):
    headline: str
    primary_drivers: List[str]
    expected_time_window: str
    recommended_actions: List[str]
    explanation: str

def generate_future_alert_content(
    future_risk: FutureRisk,
    decision: FutureAwareDecision,
    escalation: EscalationStatus
) -> FutureAlertContent:
    
    if escalation.escalate:
        headline = f"URGENT — {escalation.reason}"
    else:
        headline = f"{decision.priority} — {decision.severity} Risk Identified"
        
    actions = get_action_recommendations(decision.priority)
    
    explanation_parts = [headline, ""]
    
    if future_risk.trend.rainfall_trend == "rising" and future_risk.trend.instability_trend == "rising":
        explanation_parts.append("Rainfall and atmospheric instability are rising.")
    elif future_risk.trend.rainfall_trend == "rising":
        explanation_parts.append("Rainfall intensity is increasing.")
        
    explanation_parts.append(f"Potential impact is expected within {future_risk.time_to_impact.estimated_hours} hours.")
    explanation_parts.append(" ".join(actions))
    
    return FutureAlertContent(
        headline=headline,
        primary_drivers=future_risk.fused_risk.contributing_factors,
        expected_time_window=future_risk.time_to_impact.window_description,
        recommended_actions=actions,
        explanation="\n".join(explanation_parts)
    )
