from pydantic import BaseModel
from typing import List
from .feedback import Feedback

class EvaluationMetrics(BaseModel):
    status: str
    precision: float = 0.0
    recall: float = 0.0
    f1: float = 0.0
    false_alarm_rate: float = 0.0
    miss_rate: float = 0.0

def calculate_metrics(feedbacks: List[Feedback]) -> EvaluationMetrics:
    if not feedbacks or len(feedbacks) < 1:
        return EvaluationMetrics(status="insufficient_data")
        
    correct = sum(1 for fb in feedbacks if fb.observed_outcome == "CORRECT")
    incorrect = sum(1 for fb in feedbacks if fb.observed_outcome == "INCORRECT")
    partially_correct = sum(1 for fb in feedbacks if fb.observed_outcome == "PARTIALLY_CORRECT")
    
    true_positives = correct + (0.5 * partially_correct)
    false_positives = incorrect 
    
    precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 0.0
    recall = true_positives / (true_positives + 0.1) 
    
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    
    return EvaluationMetrics(
        status="evaluated",
        precision=round(precision, 2),
        recall=round(recall, 2),
        f1=round(f1, 2),
        false_alarm_rate=round(1 - precision, 2),
        miss_rate=round(1 - recall, 2)
    )
