from typing import List
from .historical_observation import HistoricalObservation
from .historical_api_models import HistoricalBaseline

def calculate_historical_baseline(observations: List[HistoricalObservation]) -> HistoricalBaseline:
    if not observations:
        return HistoricalBaseline()
        
    rainfalls = [obs.rainfall for obs in observations if obs.rainfall is not None]
    risks = [obs.risk_score for obs in observations if obs.risk_score is not None]
    capes = [obs.cape for obs in observations if obs.cape is not None]
    humidities = [obs.humidity for obs in observations if obs.humidity is not None]
    
    avg_rainfall = sum(rainfalls) / len(rainfalls) if rainfalls else None
    max_rainfall = max(rainfalls) if rainfalls else None
    
    avg_risk = sum(risks) / len(risks) if risks else None
    max_risk = max(risks) if risks else None
    
    avg_cape = sum(capes) / len(capes) if capes else None
    avg_humidity = sum(humidities) / len(humidities) if humidities else None
    
    return HistoricalBaseline(
        average_rainfall=avg_rainfall,
        maximum_rainfall=max_rainfall,
        average_risk=avg_risk,
        maximum_risk=max_risk,
        average_cape=avg_cape,
        average_humidity=avg_humidity
    )
