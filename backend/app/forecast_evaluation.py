from pydantic import BaseModel
from typing import List
from .feedback import Feedback
from .evaluation_metrics import calculate_metrics, EvaluationMetrics

class ForecastEvaluation(BaseModel):
    evaluation_status: str
    sample_count: int
    metrics: EvaluationMetrics
    limitations: List[str]
    disclaimer: str = "PROTOTYPE evaluation. Not a validated ML model."

def evaluate_forecast(feedbacks: List[Feedback]) -> ForecastEvaluation:
    count = len(feedbacks)
    if count < 5:
        status = "insufficient_data"
    else:
        status = "evaluated"
        
    metrics = calculate_metrics(feedbacks)
    
    return ForecastEvaluation(
        evaluation_status=status,
        sample_count=count,
        metrics=metrics,
        limitations=[
            "Low sample count for statistical significance.",
            "Feedback is subjective and manually reported.",
            "Model is rule-based, not ML-trained."
        ]
    )
