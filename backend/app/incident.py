from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

class Incident(BaseModel):
    incident_id: str
    cell_id: str
    hazard: str
    severity: str
    started_at: str
    status: str
    risk_score: int
    decision: Optional[str] = None
