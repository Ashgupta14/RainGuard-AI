from pydantic import BaseModel
from typing import List
from .future_risk import FutureRisk
from .future_risk_decision import FutureAwareDecision
from .dynamic_time_to_impact import TimeToImpact

class EscalationStatus(BaseModel):
    escalate: bool
    reasons: List[str]

def check_alert_escalation(
    future_risk_score: int, 
    current_risk_score: int, 
    time_to_impact: TimeToImpact,
    ground_impact_score: int
) -> EscalationStatus:
    escalate = False
    reasons = []
    
    if future_risk_score >= 80:
        escalate = True
        reasons.append("Future risk is critical")
        
    if time_to_impact.is_urgent:
        escalate = True
        reasons.append("Time-to-impact is under 2 hours")
        
    if ground_impact_score >= 75:
        escalate = True
        reasons.append("Ground impact is high")
        
    if future_risk_score > current_risk_score + 15:
        escalate = True
        reasons.append("Risk is rapidly increasing")
        
    if not reasons:
        reasons.append("Risk is stable.")
        
    return EscalationStatus(escalate=escalate, reasons=reasons)
