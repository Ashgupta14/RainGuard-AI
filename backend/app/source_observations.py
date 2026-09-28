from pydantic import BaseModel
from typing import Optional

class BaseObservation(BaseModel):
    source: str
    timestamp: str
    latitude: float
    longitude: float
    quality: int

class SatelliteObservation(BaseObservation):
    cloud_top_temperature: Optional[float] = None
    water_vapor_brightness: Optional[float] = None
    infrared_radiance: Optional[float] = None

class RadarObservation(BaseObservation):
    reflectivity_dbz: Optional[float] = None
    radial_velocity: Optional[float] = None
    echo_top_height: Optional[float] = None

class WeatherModelObservation(BaseObservation):
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    pressure: Optional[float] = None
    rainfall: Optional[float] = None
    wind_speed: Optional[float] = None
    wind_direction: Optional[float] = None
    cape: Optional[float] = None
    cin: Optional[float] = None

class WeatherStationObservation(BaseObservation):
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    pressure: Optional[float] = None
    rainfall: Optional[float] = None
    wind_speed: Optional[float] = None

class DEMObservation(BaseObservation):
    elevation: Optional[float] = None
    slope: Optional[float] = None
    aspect: Optional[float] = None
