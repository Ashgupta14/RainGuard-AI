from abc import ABC, abstractmethod
from typing import Any
from .ml_features import MLFeatureVector

class MLModelInterface(ABC):
    
    @abstractmethod
    def train(self, dataset: Any):
        pass
        
    @abstractmethod
    def predict(self, features: MLFeatureVector) -> dict:
        pass
        
    @abstractmethod
    def evaluate(self, dataset: Any) -> dict:
        pass
        
    @abstractmethod
    def is_trained(self) -> bool:
        pass
        
    @abstractmethod
    def model_name(self) -> str:
        pass
