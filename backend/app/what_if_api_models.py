from pydantic import BaseModel
from .models import GridCellIntelligence
from .what_if_decision import WhatIfComparison

class WhatIfRequest(BaseModel):
    latitude: float
    longitude: float
    rainfall_change: float = 0.0
    cape_change: float = 0.0
    humidity_change: float = 0.0
    pressure_change: float = 0.0
    wind_change: float = 0.0

class WhatIfResponse(BaseModel):
    disclaimer: str = "Scenario simulation — not a forecast."
    current_state: GridCellIntelligence
    simulated_state: GridCellIntelligence
    comparison: WhatIfComparison
