from pydantic import BaseModel
from typing import Dict, List
from .provider_adapter import ProviderAdapterInterface
from .open_meteo_adapter import OpenMeteoAdapter
from .satellite_adapter import SatelliteAdapter
from .radar_adapter import RadarAdapter
from .weather_station_adapter import WeatherStationAdapter
from .nwp_adapter import NWPAdapter
from .dem_adapter import DEMAdapter

class ProviderEntry(BaseModel):
    name: str
    type: str
    status: str
    capabilities: List[str]

class ProviderAdapterRegistry:
    def __init__(self):
        self.adapters: Dict[str, ProviderAdapterInterface] = {
            "Open-Meteo": OpenMeteoAdapter(),
            "INSAT": SatelliteAdapter(),
            "Radar": RadarAdapter(),
            "Weather Stations": WeatherStationAdapter(),
            "NWP": NWPAdapter(),
            "DEM": DEMAdapter()
        }
        
    def get_adapter(self, name: str) -> ProviderAdapterInterface:
        return self.adapters.get(name)
        
    def get_all_entries(self) -> List[ProviderEntry]:
        return [
            ProviderEntry(name="Open-Meteo", type="weather_model", status=self.adapters["Open-Meteo"].health_check(), capabilities=["rainfall", "temperature", "humidity"]),
            ProviderEntry(name="INSAT", type="satellite", status=self.adapters["INSAT"].health_check(), capabilities=["cloud_top_temperature", "coverage"]),
            ProviderEntry(name="Radar", type="radar", status=self.adapters["Radar"].health_check(), capabilities=["reflectivity", "storm_motion"]),
            ProviderEntry(name="Weather Stations", type="surface_station", status=self.adapters["Weather Stations"].health_check(), capabilities=["temperature", "rainfall", "wind"]),
            ProviderEntry(name="NWP", type="numerical_model", status=self.adapters["NWP"].health_check(), capabilities=["CAPE", "CIN", "precipitation"]),
            ProviderEntry(name="DEM", type="terrain", status=self.adapters["DEM"].health_check(), capabilities=["elevation", "slope", "drainage"])
        ]

provider_registry = ProviderAdapterRegistry()
