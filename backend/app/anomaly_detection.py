from .historical_api_models import HistoricalBaseline, AnomalyResult

def detect_anomaly(
    current_rainfall: float, 
    current_risk: int, 
    baseline: HistoricalBaseline
) -> AnomalyResult:
    score = 0.0
    
    if baseline.average_rainfall is not None and baseline.average_rainfall > 0:
        if current_rainfall > baseline.average_rainfall * 3:
            score += 50
        elif current_rainfall > baseline.average_rainfall * 2:
            score += 30
        elif current_rainfall > baseline.average_rainfall:
            score += 10
            
    if baseline.average_risk is not None and baseline.average_risk > 0:
        if current_risk > baseline.average_risk + 30:
            score += 50
        elif current_risk > baseline.average_risk + 15:
            score += 30
        elif current_risk > baseline.average_risk:
            score += 10
            
    score = min(100.0, score)
    
    if score >= 80:
        status = "extreme"
    elif score >= 50:
        status = "unusual"
    elif score >= 20:
        status = "elevated"
    else:
        status = "normal"
        
    return AnomalyResult(status=status, anomaly_score=score)
