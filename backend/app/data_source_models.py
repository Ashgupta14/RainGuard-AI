from pydantic import BaseModel
from typing import Optional

class BaseObservation(BaseModel):
    source_id: str
    latitude: float
    longitude: float
    timestamp: str

class SatelliteObservation(BaseObservation):
    cloud_top_temperature: Optional[float] = None
    water_vapor: Optional[float] = None

class RadarObservation(BaseObservation):
    reflectivity_dbz: Optional[float] = None
    velocity: Optional[float] = None

class StationObservation(BaseObservation):
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    pressure: Optional[float] = None
    rainfall: Optional[float] = None
    wind_speed: Optional[float] = None
    wind_direction: Optional[float] = None

class NWPObservation(BaseObservation):
    cape: Optional[float] = None
    cin: Optional[float] = None

class DEMObservation(BaseObservation):
    elevation_m: Optional[float] = None
    slope_degrees: Optional[float] = None
