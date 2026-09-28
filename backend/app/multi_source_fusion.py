from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from .source_availability import get_source_availability, SourceState
from .fusion_provenance import FusionProvenance

class UnifiedObservation:
    def __init__(self, lat: float, lon: float, data: Dict[str, Any], provenance: FusionProvenance):
        self.latitude = lat
        self.longitude = lon
        self.data = data
        self.provenance = provenance

def fuse_observations(lat: float, lon: float, available_data: Dict[str, Any]) -> UnifiedObservation:
    availability = get_source_availability()
    
    attempted = ["weather-model", "radar", "satellite", "weather-station", "nwp", "dem"]
    used = []
    skipped = []
    
    fused_data = {}
    
    for source in attempted:
        if availability.get(source) == SourceState.LIVE and source in available_data:
            used.append(source)
            fused_data.update(available_data[source])
        else:
            skipped.append(source)
            
    method = "quality-weighted-source-selection"
    quality = 92 if "weather-model" in used else 0
    
    provenance = FusionProvenance(
        sources_attempted=attempted,
        sources_used=used,
        sources_skipped=skipped,
        fusion_method=method,
        quality=quality,
        timestamp=datetime.now(timezone.utc).isoformat()
    )
    
    return UnifiedObservation(lat=lat, lon=lon, data=fused_data, provenance=provenance)
