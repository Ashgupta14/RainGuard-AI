from pydantic import BaseModel
from typing import List
from .feedback import Feedback

class CalibrationStats(BaseModel):
    total_predictions: int
    confirmed_outcomes: int
    correct_predictions: int
    incorrect_predictions: int
    accuracy: float
    disclaimer: str = "PROTOTYPE stats. Not statistically validated model accuracy."

def calculate_calibration_stats(feedbacks: List[Feedback]) -> CalibrationStats:
    total = len(feedbacks)
    confirmed = sum(1 for fb in feedbacks if fb.observed_outcome != "UNKNOWN")
    correct = sum(1 for fb in feedbacks if fb.observed_outcome == "CORRECT")
    incorrect = sum(1 for fb in feedbacks if fb.observed_outcome == "INCORRECT")
    
    accuracy = (correct / confirmed) * 100 if confirmed > 0 else 0.0
    
    return CalibrationStats(
        total_predictions=total,
        confirmed_outcomes=confirmed,
        correct_predictions=correct,
        incorrect_predictions=incorrect,
        accuracy=round(accuracy, 2)
    )
