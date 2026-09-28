from typing import Optional, List, Dict
from datetime import datetime, timezone
from .data_source_models import (
    SatelliteObservation,
    RadarObservation,
    StationObservation,
    NWPObservation,
    DEMObservation
)
from .provider_capabilities import get_provider_status

class FusionCoordinator:
    def __init__(self) -> None:
        pass

    def check_availability(self, provider_id: str) -> bool:
        return get_provider_status(provider_id) == "LIVE"

    def fuse_station_data(self, latitude: float, longitude: float) -> Optional[StationObservation]:
        if self.check_availability("open_meteo"):
            return StationObservation(
                source_id="fused_station",
                latitude=latitude,
                longitude=longitude,
                timestamp=datetime.now(timezone.utc).isoformat(),
            )
        return None

    def fuse_radar_data(self, latitude: float, longitude: float) -> Optional[RadarObservation]:
        if self.check_availability("radar"):
            pass
        return None

    def get_fusion_status(self) -> Dict[str, str]:
        return {
            "satellite": get_provider_status("insat"),
            "radar": get_provider_status("radar"),
            "stations": get_provider_status("open_meteo"),
            "nwp": get_provider_status("nwp"),
            "dem": get_provider_status("dem")
        }
