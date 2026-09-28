from abc import ABC, abstractmethod
from typing import Any, Dict

class ProviderAdapterInterface(ABC):
    
    @abstractmethod
    def fetch(self) -> Any:
        pass
        
    @abstractmethod
    def validate(self, data: Any) -> bool:
        pass
        
    @abstractmethod
    def normalize(self, data: Any) -> Dict[str, Any]:
        pass
        
    @abstractmethod
    def health_check(self) -> str:
        pass
