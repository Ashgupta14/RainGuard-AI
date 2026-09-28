from pydantic import BaseModel
from typing import List

class FutureRiskAPI(BaseModel):
    score: int
    level: str

class TrendAPI(BaseModel):
    rainfall: str
    instability: str
    pressure: str

class TimeToImpactAPI(BaseModel):
    window: str

from typing import Any

class DecisionAPI(BaseModel):
    priority: str
    severity: str
    risk_drivers: List[str]
    change_summary: Any
    impact_projection: Any
    escalation: Any
    recommended_actions: List[str]
    explanation: str
