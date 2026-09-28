from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Feedback(BaseModel):
    alert_id: str
    cell_id: str
    observed_outcome: str 
    actual_hazard: Optional[str] = None
    actual_severity: Optional[str] = None
    user_feedback: Optional[str] = None
    timestamp: str = ""
    source: str
