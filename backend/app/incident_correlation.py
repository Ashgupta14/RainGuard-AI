from typing import List
import uuid
from datetime import datetime, timezone
from .incident import Incident
from .incident_store import incident_store
from .models import RainGuardAlert

def correlate_alerts_to_incidents(alerts: List[RainGuardAlert]):
    active_incidents = [i for i in incident_store.list_incidents() if i.status in ["OPEN", "MONITORING"]]
    
    for alert in alerts:
        existing_incident = next(
            (i for i in active_incidents if i.cell_id == alert.cell_id and i.hazard == alert.hazard), 
            None
        )
        
        if existing_incident:
            if alert.risk_score > existing_incident.risk_score:
                incident_store.update_incident(existing_incident.incident_id, {
                    "risk_score": alert.risk_score,
                    "severity": alert.severity,
                    "decision": alert.action
                })
        else:
            new_incident = Incident(
                incident_id=f"INC-{uuid.uuid4().hex[:8].upper()}",
                cell_id=alert.cell_id,
                hazard=alert.hazard,
                severity=alert.severity,
                started_at=datetime.now(timezone.utc).isoformat(),
                status="OPEN",
                risk_score=alert.risk_score,
                decision=alert.action
            )
            incident_store.create_incident(new_incident)
            active_incidents.append(new_incident)
