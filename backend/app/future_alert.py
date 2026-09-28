from pydantic import BaseModel
from typing import List
from .trend_engine import AtmosphericTrend
from .dynamic_time_to_impact import TimeToImpact

class FutureAlert(BaseModel):
    cell_id: str
    severity: str
    priority: str
    current_risk: int
    future_risk: int
    trend: AtmosphericTrend
    time_to_impact: TimeToImpact
    confidence: int
    escalation: bool
    explanation: str
    recommended_actions: List[str]
