from enum import Enum
from typing import Dict
from .provider_adapter_registry import provider_registry

class SourceState(str, Enum):
    LIVE = "LIVE"
    PLANNED = "PLANNED"
    UNAVAILABLE = "UNAVAILABLE"

def get_source_availability() -> Dict[str, SourceState]:
    availability = {}
    for entry in provider_registry.get_all_entries():
        key = entry.name.lower().replace(" ", "-")
        try:
            state = SourceState(entry.status.upper())
            availability[key] = state
        except ValueError:
            availability[key] = SourceState.PLANNED
            
    if "open-meteo" in availability:
        availability["weather-model"] = availability["open-meteo"]
    if "weather-stations" in availability:
        availability["weather-station"] = availability["weather-stations"]
        
    return availability

def is_source_available(source: str) -> bool:
    availability = get_source_availability()
    return availability.get(source) == SourceState.LIVE
