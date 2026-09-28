from pydantic import BaseModel
from datetime import datetime, timezone
from typing import Optional
from .provider_adapter_registry import provider_registry

class DataSourceStatus(BaseModel):
    mode: str
    provider: str
    status: str
    is_simulated: bool
    fallback_used: bool
    fallback_reason: Optional[str] = None
    source_type: str
    generated_at: str

def get_data_source_status(mode: str, provider: str, fallback_used: bool, fallback_reason: Optional[str]) -> DataSourceStatus:
    is_simulated = (mode in ["demo", "fallback"] or fallback_used)
    
    entry = next((e for e in provider_registry.get_all_entries() if e.name == provider), None)
    
    status = "Operational" if mode == "live" else "Simulated"
    if entry and entry.status == "UNAVAILABLE":
        status = "Unavailable"
        
    source_type = entry.type if entry else ("synthetic" if is_simulated else "weather-model")
    
    return DataSourceStatus(
        mode=mode,
        provider=provider,
        status=status,
        is_simulated=is_simulated,
        fallback_used=fallback_used,
        fallback_reason=fallback_reason,
        source_type=source_type,
        generated_at=datetime.now(timezone.utc).isoformat()
    )
