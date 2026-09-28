from pydantic import BaseModel

class WhatIfValidationResult(BaseModel):
    is_valid: bool
    message: str

def validate_what_if_inputs(
    rainfall_change: float,
    cape_change: float,
    humidity_change: float,
    pressure_change: float,
    wind_change: float,
    current_rainfall: float = 0.0,
    current_humidity: float = 50.0,
    current_cape: float = 0.0,
    current_wind: float = 0.0
) -> WhatIfValidationResult:
    if current_rainfall + rainfall_change < 0:
        return WhatIfValidationResult(is_valid=False, message="Rainfall cannot be negative.")
    if current_humidity + humidity_change < 0 or current_humidity + humidity_change > 100:
        return WhatIfValidationResult(is_valid=False, message="Humidity must remain between 0 and 100%.")
    if current_cape + cape_change < 0:
        return WhatIfValidationResult(is_valid=False, message="CAPE cannot be negative.")
    if current_wind + wind_change < 0:
        return WhatIfValidationResult(is_valid=False, message="Wind speed cannot be negative.")
        
    return WhatIfValidationResult(is_valid=True, message="Valid scenario.")
