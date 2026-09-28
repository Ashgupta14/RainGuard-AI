from .models import GridCellIntelligence
from .historical_api_models import HistoricalBaseline, HistoricalComparison, AnomalyResult

def compare_historical(
    current: GridCellIntelligence, 
    baseline: HistoricalBaseline,
    anomaly: AnomalyResult
) -> HistoricalComparison:
    
    risk_change = f"Current Risk ({current.overall_risk_score}) vs Avg ({int(baseline.average_risk) if baseline.average_risk else 'N/A'})"
    
    current_rain = current.cell.rainfall or 0.0
    if baseline.average_rainfall is not None:
        if current_rain > baseline.average_rainfall * 2:
            rain_anom = "Significantly above average"
        elif current_rain > baseline.average_rainfall:
            rain_anom = "Above average"
        else:
            rain_anom = "Normal or below average"
    else:
        rain_anom = "No historical rainfall data"
        
    atm_anom = "Normal"
    if anomaly.status in ["unusual", "extreme"]:
        atm_anom = "Highly unstable compared to baseline"
        
    explanation = f"Prototype Historical Intelligence / Baseline: Conditions are currently {anomaly.status}."
    
    return HistoricalComparison(
        risk_change=risk_change,
        rainfall_anomaly=rain_anom,
        atmospheric_anomaly=atm_anom,
        overall_anomaly=anomaly.status,
        explanation=explanation
    )
