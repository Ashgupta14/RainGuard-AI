from pydantic import BaseModel
from typing import Optional, List
from .provider_adapter_registry import provider_registry

class ProviderStatus(BaseModel):
    name: str
    type: str
    status: str
    coverage: int
    quality: int
    observation_count: int
    rejected_observations: int
    last_successful_fetch: Optional[str] = None
    capabilities: List[str] = []

def get_provider_status(mode: str, provider: str, valid_obs: int, rejected_obs: int, last_fetch: Optional[str] = None) -> ProviderStatus:
    if mode in ["demo", "fallback"]:
        return ProviderStatus(
            name="RainGuard Synthetic Weather Engine",
            type="synthetic",
            status="operational",
            coverage=100,
            quality=100,
            observation_count=900,
            rejected_observations=0,
            last_successful_fetch=last_fetch,
            capabilities=["synthetic-data"]
        )
    else:
        entry = next((e for e in provider_registry.get_all_entries() if e.name == provider), None)
        provider_type = entry.type if entry else "weather-model"
        capabilities = entry.capabilities if entry else []
        
        return ProviderStatus(
            name=provider,
            type=provider_type,
            status="available",
            coverage=100,
            quality=100,
            observation_count=valid_obs,
            rejected_observations=rejected_obs,
            last_successful_fetch=last_fetch,
            capabilities=capabilities
        )
