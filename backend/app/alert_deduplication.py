from typing import List, Set
from .models import RainGuardAlert

def deduplicate_alerts(alerts: List[RainGuardAlert]) -> List[RainGuardAlert]:
    seen: Set[str] = set()
    unique_alerts: List[RainGuardAlert] = []
    
    for alert in alerts:
        identity = f"{alert.cell_id}-{alert.hazard}"
        if identity not in seen:
            seen.add(identity)
            unique_alerts.append(alert)
            
    return unique_alerts
