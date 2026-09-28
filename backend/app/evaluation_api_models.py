from pydantic import BaseModel
from typing import Optional, List
from .feedback import Feedback
from .forecast_evaluation import ForecastEvaluation
from .calibration import CalibrationStats
from .self_calibration import CalibrationSuggestion

class FeedbackRequest(BaseModel):
    alert_id: str
    cell_id: str
    observed_outcome: str
    actual_hazard: Optional[str] = None
    actual_severity: Optional[str] = None
    user_feedback: Optional[str] = None
    source: str = "prototype-evaluation"

class FeedbackResponse(BaseModel):
    status: str = "accepted"
    feedback: Feedback

class EvaluationSummary(BaseModel):
    forecast_evaluation: ForecastEvaluation

class CalibrationSummary(BaseModel):
    calibration_stats: CalibrationStats
    suggestions: List[CalibrationSuggestion]
