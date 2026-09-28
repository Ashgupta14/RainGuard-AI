from pydantic import BaseModel
from .grid import MIN_LATITUDE, MAX_LATITUDE, MIN_LONGITUDE, MAX_LONGITUDE

class LocationValidationResult(BaseModel):
    is_valid: bool
    message: str

def validate_location(latitude: float, longitude: float) -> LocationValidationResult:
    if not (-90 <= latitude <= 90):
        return LocationValidationResult(is_valid=False, message="Latitude must be between -90 and 90.")
    if not (-180 <= longitude <= 180):
        return LocationValidationResult(is_valid=False, message="Longitude must be between -180 and 180.")
        
    if not (MIN_LATITUDE <= latitude <= MAX_LATITUDE and MIN_LONGITUDE <= longitude <= MAX_LONGITUDE):
        return LocationValidationResult(
            is_valid=False, 
            message=f"Location is outside the configured grid boundaries. Supported range: Lat {MIN_LATITUDE} to {MAX_LATITUDE}, Lon {MIN_LONGITUDE} to {MAX_LONGITUDE}."
        )
        
    return LocationValidationResult(is_valid=True, message="Valid location.")
