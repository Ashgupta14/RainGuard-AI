from pydantic import BaseModel

class ImpactProjection(BaseModel):
    projection: str
    
def project_impact(future_risk_score: int, ground_impact_score: int) -> ImpactProjection:
    if future_risk_score >= 85 and ground_impact_score >= 80:
        return ImpactProjection(projection="Imminent impact")
    elif future_risk_score >= 75 or ground_impact_score >= 75:
        return ImpactProjection(projection="Severe impact increasingly likely")
    elif future_risk_score >= 60:
        return ImpactProjection(projection="Flash-flood conditions developing")
    elif future_risk_score >= 40:
        return ImpactProjection(projection="Localized waterlogging possible")
    else:
        return ImpactProjection(projection="No immediate impact")
