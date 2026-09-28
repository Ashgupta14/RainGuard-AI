from pydantic import BaseModel
from typing import List

class ModelMetadata(BaseModel):
    name: str
    version: str
    type: str
    trained: bool
    evaluation_status: str
    active: bool

class ModelRegistry:
    def __init__(self):
        self.models = [
            ModelMetadata(
                name="Rule-Based Forecast Baseline",
                version="1.0",
                type="rule-based",
                trained=False,
                evaluation_status="prototype",
                active=True
            )
        ]
        
    def get_active_model_metadata(self) -> ModelMetadata:
        for m in self.models:
            if m.active:
                return m
        return self.models[0]
        
model_registry = ModelRegistry()
