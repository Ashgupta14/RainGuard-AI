from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

class ProviderHealthState(BaseModel):
    status: str # HEALTHY, DEGRADED, UNAVAILABLE
    provider: str
    last_success: Optional[str]
    last_failure: Optional[str]
    success_count: int
    failure_count: int
    last_error: Optional[str]

class ProviderHealthMonitor:
    def __init__(self, provider: str):
        self.state = ProviderHealthState(
            status="UNAVAILABLE",
            provider=provider,
            last_success=None,
            last_failure=None,
            success_count=0,
            failure_count=0,
            last_error=None
        )

    def record_success(self):
        self.state.success_count += 1
        self.state.last_success = datetime.now(timezone.utc).isoformat()
        self.update_status()

    def record_failure(self, error_msg: str):
        self.state.failure_count += 1
        self.state.last_failure = datetime.now(timezone.utc).isoformat()
        self.state.last_error = error_msg
        self.update_status()

    def update_status(self):
        if self.state.success_count > 0 and self.state.failure_count == 0:
            self.state.status = "HEALTHY"
        elif self.state.failure_count > 0 and self.state.success_count > 0:
            self.state.status = "DEGRADED"
        else:
            self.state.status = "UNAVAILABLE"
