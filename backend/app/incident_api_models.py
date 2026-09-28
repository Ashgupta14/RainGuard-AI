from pydantic import BaseModel
from typing import List, Optional
from .incident import Incident

class IncidentResponse(BaseModel):
    incident: Incident
    
class IncidentListResponse(BaseModel):
    incidents: List[Incident]
    
class IncidentUpdateRequest(BaseModel):
    status: Optional[str] = None
    decision: Optional[str] = None
