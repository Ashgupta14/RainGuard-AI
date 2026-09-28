from typing import List
from .historical_observation import HistoricalObservation
from .historical_api_models import RiskFingerprint
from .models import GridCellIntelligence

def generate_risk_fingerprint(
    cell: GridCellIntelligence, 
    observations: List[HistoricalObservation]
) -> RiskFingerprint:
    flood_susceptibility = "Unknown"
    if cell.ground_impact:
        if cell.ground_impact.score >= 75:
            flood_susceptibility = "High"
        elif cell.ground_impact.score >= 50:
            flood_susceptibility = "Moderate"
        else:
            flood_susceptibility = "Low"
            
    rain_tendency = "Insufficient data"
    risk_tendency = "Insufficient data"
    hazards = set()
    
    if observations:
        rainfalls = [obs.rainfall for obs in observations if obs.rainfall is not None]
        if rainfalls:
            avg_rain = sum(rainfalls) / len(rainfalls)
            rain_tendency = "High" if avg_rain > 20 else "Moderate" if avg_rain > 5 else "Low"
            
        risks = [obs.risk_score for obs in observations if obs.risk_score is not None]
        if risks:
            avg_risk = sum(risks) / len(risks)
            risk_tendency = "High" if avg_risk > 60 else "Moderate" if avg_risk > 30 else "Low"
            
        for obs in observations:
            if obs.hazard:
                hazards.add(obs.hazard)
                
    if not hazards:
        hazards.add("Flood risk")
        
    terrain_susceptibility = "Low-lying" if cell.ground_impact and cell.ground_impact.score >= 75 else "Moderate gradient"
    exposure_susceptibility = "High population density" if cell.ground_impact and cell.ground_impact.score >= 60 else "Moderate exposure"
    
    return RiskFingerprint(
        flood_susceptibility=flood_susceptibility,
        historical_rainfall_tendency=rain_tendency,
        historical_risk_tendency=risk_tendency,
        terrain_susceptibility=terrain_susceptibility,
        exposure_susceptibility=exposure_susceptibility,
        common_hazards=list(hazards)
    )
