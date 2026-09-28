from typing import List
from pydantic import BaseModel

class RiskDriver(BaseModel):
    driver: str
    contribution: int

def identify_risk_drivers(
    current_risk_score: int,
    rainfall_trend: str,
    rainfall_intensity: str,
    atmospheric_trend: str,
    ground_impact_score: int
) -> List[str]:
    drivers = []
    
    if rainfall_intensity in ["HEAVY", "VERY_HEAVY"]:
        drivers.append(RiskDriver(driver="Heavy rainfall", contribution=30))
    if rainfall_trend == "RISING":
        drivers.append(RiskDriver(driver="Rising rainfall trend", contribution=25))
    if atmospheric_trend == "WORSENING":
        drivers.append(RiskDriver(driver="Atmospheric instability rising", contribution=20))
    if ground_impact_score > 75:
        drivers.append(RiskDriver(driver="High road exposure and low drainage capacity", contribution=25))
    elif ground_impact_score > 50:
        drivers.append(RiskDriver(driver="Elevated ground impact susceptibility", contribution=15))
        
    if not drivers:
        drivers.append(RiskDriver(driver="Baseline weather activity", contribution=10))
        
    drivers.sort(key=lambda x: x.contribution, reverse=True)
    return [d.driver for d in drivers]
