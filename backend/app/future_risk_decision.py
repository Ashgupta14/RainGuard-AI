from pydantic import BaseModel
from .cell_decision import CellDecision
from .future_risk import FutureRisk

class FutureAwareDecision(BaseModel):
    priority: str
    severity: str
    original_decision: CellDecision

def decide_future_risk(current_decision: CellDecision, future_risk: FutureRisk) -> FutureAwareDecision:
    priority = current_decision.priority
    severity = current_decision.severity
    
    if future_risk.fused_risk.level == "Critical" and future_risk.trend.rainfall_trend == "rising":
        priority = "URGENT ACTION"
        severity = "Critical"
    elif future_risk.fused_risk.level == "High" and future_risk.trend.rainfall_trend == "rising":
        if priority in ["MONITOR", "WATCH"]:
            priority = "PREPARE"
        severity = "High"
        
    return FutureAwareDecision(
        priority=priority,
        severity=severity,
        original_decision=current_decision
    )
