from pydantic import BaseModel
from datetime import datetime, timezone

class DataProvenance(BaseModel):
    mode: str
    provider: str
    source_type: str
    is_simulated: bool
    timestamp: str

def determine_provenance(provider_name: str, mode: str) -> DataProvenance:
    is_simulated = (mode in ["demo", "fallback", "planned"])
    return DataProvenance(
        mode=mode,
        provider=provider_name,
        source_type="live_sensor" if not is_simulated else "synthetic_engine",
        is_simulated=is_simulated,
        timestamp=datetime.now(timezone.utc).isoformat()
    )
