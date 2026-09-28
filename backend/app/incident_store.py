from typing import List, Dict, Optional
from .incident import Incident
from datetime import datetime, timezone

class IncidentStore:
    def __init__(self):
        self._incidents: Dict[str, Incident] = {}
        
    def create_incident(self, incident: Incident) -> Incident:
        self._incidents[incident.incident_id] = incident
        return incident
        
    def get_incident(self, incident_id: str) -> Optional[Incident]:
        return self._incidents.get(incident_id)
        
    def list_incidents(self) -> List[Incident]:
        return list(self._incidents.values())
        
    def update_incident(self, incident_id: str, updates: dict) -> Optional[Incident]:
        incident = self.get_incident(incident_id)
        if incident:
            updated_data = incident.model_dump()
            updated_data.update(updates)
            updated_incident = Incident(**updated_data)
            self._incidents[incident_id] = updated_incident
            return updated_incident
        return None
        
    def resolve_incident(self, incident_id: str) -> Optional[Incident]:
        return self.update_incident(incident_id, {"status": "RESOLVED"})

incident_store = IncidentStore()
