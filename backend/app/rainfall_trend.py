def classify_rainfall_intensity(rainfall: float) -> str:
    if rainfall < 0.1:
        return "NONE"
    elif rainfall < 2.5:
        return "LIGHT"
    elif rainfall < 7.5:
        return "MODERATE"
    elif rainfall < 15.0:
        return "HEAVY"
    else:
        return "VERY_HEAVY"

def classify_rainfall_trend(change: float) -> str:
    if change > 2.0:
        return "RISING"
    elif change < -2.0:
        return "FALLING"
    else:
        return "STABLE"

def get_rainfall_explanation(intensity: str, trend: str) -> str:
    if intensity == "NONE":
        return "No significant rainfall detected."
    
    explanation = f"Rainfall intensity is {intensity.lower().replace('_', ' ')}."
    if trend == "RISING":
        explanation += " Conditions are worsening."
    elif trend == "FALLING":
        explanation += " Conditions are improving."
    
    return explanation
