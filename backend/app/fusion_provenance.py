from pydantic import BaseModel
from typing import List

class FusionProvenance(BaseModel):
    sources_attempted: List[str]
    sources_used: List[str]
    sources_skipped: List[str]
    fusion_method: str
    quality: int
    timestamp: str
