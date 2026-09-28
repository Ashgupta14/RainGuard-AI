from pydantic import BaseModel
from typing import Optional

class CloudEvolution(BaseModel):
    cloud_top_temperature: Optional[float] = None
    cloud_top_temperature_change: Optional[float] = None
    cloud_growth_rate: Optional[float] = None
    evolution: str
    confidence: int
    source: str

def build_cloud_evolution() -> CloudEvolution:
    return CloudEvolution(
        evolution="UNKNOWN",
        confidence=0,
        source="not_connected"
    )
