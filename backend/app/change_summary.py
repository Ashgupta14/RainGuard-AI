from pydantic import BaseModel
from .trend_engine import AtmosphericTrend

class ChangeSummary(BaseModel):
    rainfall: str
    instability: str
    pressure: str
    summary_statement: str

def generate_change_summary(trend: AtmosphericTrend, rainfall_trend: str) -> ChangeSummary:
    statement = "Atmospheric conditions are stable."
    if rainfall_trend == "RISING" or trend.instability_trend == "rising":
        statement = "Atmospheric conditions are deteriorating."
    elif rainfall_trend == "FALLING" and trend.instability_trend == "falling":
        statement = "Atmospheric conditions are improving."
        
    return ChangeSummary(
        rainfall=rainfall_trend.capitalize(),
        instability=trend.instability_trend.capitalize(),
        pressure=trend.pressure_trend.capitalize(),
        summary_statement=statement
    )
