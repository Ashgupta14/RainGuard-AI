from pydantic import BaseModel
from typing import List, Optional, Any
from .models import GridRiskSummary, RainGuardAlert

class LivePipelineResult(BaseModel):
    mode: str
    provider: str
    observations_received: int
    observations_valid: int
    observations_rejected: int
    grid_rows: int
    grid_columns: int
    cells: List[Any]
    summary: Optional[GridRiskSummary] = None
    alerts: Optional[List[RainGuardAlert]] = None
    fallback_used: bool
    fallback_reason: Optional[str] = None
    generated_at: str
