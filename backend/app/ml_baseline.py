from typing import Any
from .ml_model import MLModelInterface
from .ml_features import MLFeatureVector

class BaselineRuleModel(MLModelInterface):
    
    def train(self, dataset: Any):
        pass
        
    def predict(self, features: MLFeatureVector) -> dict:
        return {
            "prediction": features.rainfall * 0.5 + features.cape * 0.1,
            "confidence": 75,
            "evaluation_status": "prototype",
            "trained": False
        }
        
    def evaluate(self, dataset: Any) -> dict:
        return {"status": "prototype", "metrics": {}}
        
    def is_trained(self) -> bool:
        return False
        
    def model_name(self) -> str:
        return "Rule-Based Forecast Baseline"
