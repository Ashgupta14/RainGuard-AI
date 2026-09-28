from pydantic import BaseModel
from .ml_features import MLFeatureVector

class MLTrainingExample(BaseModel):
    features: MLFeatureVector
    target_hazard: str
    target_severity: str
    target_risk: float
    timestamp: str
    cell_id: str
    source: str
