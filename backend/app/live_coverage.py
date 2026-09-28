from pydantic import BaseModel
from typing import List
from .live_provider import LiveObservation
from .live_quality import calculate_observation_quality

class GridCoverage(BaseModel):
    total_cells: int
    observed_cells: int
    coverage_percent: float
    reliable_cells: int
    reliable_coverage_percent: float

def calculate_live_coverage(observations: List[LiveObservation], total_cells: int = 900) -> GridCoverage:
    observed_cells = len(observations)
    reliable_cells = 0
    
    for obs in observations:
        quality = calculate_observation_quality(obs)
        if quality.quality_score >= 70 and quality.is_valid:
            reliable_cells += 1
            
    coverage = (observed_cells / total_cells) * 100 if total_cells > 0 else 0
    reliable_coverage = (reliable_cells / total_cells) * 100 if total_cells > 0 else 0
    
    return GridCoverage(
        total_cells=total_cells,
        observed_cells=observed_cells,
        coverage_percent=round(coverage, 1),
        reliable_cells=reliable_cells,
        reliable_coverage_percent=round(reliable_coverage, 1)
    )
