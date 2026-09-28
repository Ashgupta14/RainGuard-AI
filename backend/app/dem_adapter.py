from typing import Any, Dict
from .provider_adapter import ProviderAdapterInterface

class DEMAdapter(ProviderAdapterInterface):
    def fetch(self) -> Any:
        return None
        
    def validate(self, data: Any) -> bool:
        return False
        
    def normalize(self, data: Any) -> Dict[str, Any]:
        return {}
        
    def health_check(self) -> str:
        return "PLANNED"
