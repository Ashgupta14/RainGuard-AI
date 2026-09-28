from pydantic import BaseModel
from typing import List
from .ml_training_data import MLTrainingExample

class MLDataset(BaseModel):
    status: str
    examples: List[MLTrainingExample] = []
    
def build_dataset() -> MLDataset:
    return MLDataset(status="insufficient_data")

def count_samples(dataset: MLDataset) -> int:
    return len(dataset.examples)

def get_feature_matrix(dataset: MLDataset) -> List[List[float]]:
    return []

def get_targets(dataset: MLDataset) -> List[float]:
    return []
