from pydantic import BaseModel
from typing import List
from .live_provider import LiveObservation
from .live_data_validation import validate_observation

class ObservationQuality(BaseModel):
    quality_score: int
    is_valid: bool
    missing_fields: List[str]
    validation_messages: List[str]

def calculate_observation_quality(observation: LiveObservation) -> ObservationQuality:
    is_valid, errors = validate_observation(observation)
    
    expected_fields = ["temperature", "humidity", "rainfall", "wind_speed"]
    missing_fields = []
    
    for field in expected_fields:
        if getattr(observation, field, None) is None:
            missing_fields.append(field)
            
    # Score calculation
    base_score = 100
    base_score -= len(missing_fields) * 15
    base_score -= len(errors) * 20
    
    quality_score = max(0, min(100, base_score))
    
    if not is_valid:
        quality_score = 0
        
    return ObservationQuality(
        quality_score=quality_score,
        is_valid=is_valid,
        missing_fields=missing_fields,
        validation_messages=errors
    )
