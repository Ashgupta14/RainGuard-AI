from pydantic import BaseModel
from typing import List
from .change_summary import ChangeSummary
from .impact_projection import ImpactProjection
from .alert_escalation import EscalationStatus

class UnifiedDecision(BaseModel):
    priority: str
    severity: str
    risk_drivers: List[str]
    change_summary: ChangeSummary
    impact_projection: ImpactProjection
    escalation: EscalationStatus
    recommended_actions: List[str]
    historical_anomaly: str = "normal"
    explanation: str
