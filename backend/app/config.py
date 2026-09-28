import os
from pydantic import BaseModel
from typing import Dict, Any

class Settings(BaseModel):
    data_mode: str = os.getenv("RAINGUARD_DATA_MODE", "demo")
    grid_rows: int = int(os.getenv("RAINGUARD_GRID_ROWS", "30"))
    grid_cols: int = int(os.getenv("RAINGUARD_GRID_COLS", "30"))
    api_host: str = os.getenv("RAINGUARD_API_HOST", "0.0.0.0")
    api_port: int = int(os.getenv("RAINGUARD_API_PORT", "8000"))
    lead_window_targets: Dict[str, Any] = {
        "imminent": 2.0,
        "short": 4.0,
        "medium": 12.0,
        "extended": 24.0
    }
    reliability_threshold: int = int(os.getenv("RAINGUARD_RELIABILITY_THRESHOLD", "80"))

settings = Settings()
