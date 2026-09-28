from pydantic import BaseModel
from .live_coverage import GridCoverage

class ReliabilityGateStatus(BaseModel):
    status: str
    message: str

def check_reliability_gate(coverage: GridCoverage) -> ReliabilityGateStatus:
    if coverage.observed_cells == 0:
        return ReliabilityGateStatus(
            status="UNAVAILABLE",
            message="No usable live data."
        )
        
    if coverage.coverage_percent >= 80 and coverage.reliable_coverage_percent >= 70:
        return ReliabilityGateStatus(
            status="RELIABLE",
            message="Live data is complete and high quality."
        )
        
    return ReliabilityGateStatus(
        status="DEGRADED",
        message="Live data is partial or degraded."
    )
