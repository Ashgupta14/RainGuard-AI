import time
from pydantic import BaseModel
from typing import List, Optional

class PipelineStageMetric(BaseModel):
    stage: str
    duration_ms: float
    status: str

class PipelineTimer:
    def __init__(self):
        self.metrics: List[PipelineStageMetric] = []
        self._start_time: Optional[float] = None
        self._current_stage: Optional[str] = None
        
    def start_stage(self, stage: str):
        if self._start_time is not None and self._current_stage is not None:
            self.end_stage("operational")
            
        self._current_stage = stage
        self._start_time = time.time()
        
    def end_stage(self, status: str = "operational"):
        if self._start_time is not None and self._current_stage is not None:
            duration = (time.time() - self._start_time) * 1000
            self.metrics.append(PipelineStageMetric(
                stage=self._current_stage,
                duration_ms=round(duration, 2),
                status=status
            ))
            self._start_time = None
            self._current_stage = None
            
    def get_metrics(self) -> List[PipelineStageMetric]:
        return self.metrics
