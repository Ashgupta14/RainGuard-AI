from pydantic import BaseModel
from typing import List
from .feedback import Feedback

class CalibrationSuggestion(BaseModel):
    parameter: str
    current_value: float
    suggested_value: float
    reason: str
    action: str = "MANUAL_REVIEW_REQUIRED"

def generate_calibration_proposals(feedbacks: List[Feedback]) -> List[CalibrationSuggestion]:
    if len(feedbacks) < 3:
        return []
        
    incorrect = [fb for fb in feedbacks if fb.observed_outcome == "INCORRECT"]
    if incorrect:
        return [
            CalibrationSuggestion(
                parameter="rainfall_weight",
                current_value=0.50,
                suggested_value=0.55,
                reason="Repeated underestimation during heavy-rain events observed in feedback."
            )
        ]
    return []
