from dataclasses import dataclass
from typing import List

@dataclass
class ProviderCapability:
    name: str
    status: str
    supported_observations: List[str]
    description: str

PROVIDER_REGISTRY = {
    "open_meteo": ProviderCapability(
        name="Open-Meteo",
        status="LIVE",
        supported_observations=["station", "nwp"],
        description="Global weather API for surface and atmospheric conditions."
    ),
    "imd": ProviderCapability(
        name="IMD",
        status="PLANNED",
        supported_observations=["station", "radar", "satellite"],
        description="India Meteorological Department data."
    ),
    "radar": ProviderCapability(
        name="Radar Network",
        status="PLANNED",
        supported_observations=["radar"],
        description="Doppler weather radar network."
    ),
    "insat": ProviderCapability(
        name="INSAT",
        status="PLANNED",
        supported_observations=["satellite"],
        description="Indian National Satellite System."
    ),
    "weather_stations": ProviderCapability(
        name="Weather Stations",
        status="PLANNED",
        supported_observations=["station"],
        description="Ground-level automatic weather stations."
    ),
    "nwp": ProviderCapability(
        name="NWP",
        status="PLANNED",
        supported_observations=["nwp"],
        description="Numerical Weather Prediction models."
    ),
    "dem": ProviderCapability(
        name="DEM",
        status="PLANNED",
        supported_observations=["dem"],
        description="Digital Elevation Model."
    ),
    "synthetic": ProviderCapability(
        name="Synthetic Proxy",
        status="DEMO",
        supported_observations=["station", "nwp", "dem"],
        description="Prototype synthetic data generator."
    )
}

def get_provider_status(provider_id: str) -> str:
    provider = PROVIDER_REGISTRY.get(provider_id)
    if provider:
        return provider.status
    return "UNKNOWN"
