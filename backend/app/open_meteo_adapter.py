from typing import Any, Dict
from .provider_adapter import ProviderAdapterInterface

class OpenMeteoAdapter(ProviderAdapterInterface):
    def fetch(self) -> Any:
        return None
        
    def validate(self, data: Any) -> bool:
        return True
        
    def normalize(self, data: Any) -> Dict[str, Any]:
        return data if isinstance(data, dict) else {}
        
    def health_check(self) -> str:
        return "LIVE"
