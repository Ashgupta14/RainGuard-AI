from dataclasses import dataclass
from typing import Optional

from .models import GridCellIntelligence
from .atmospheric_intelligence import AtmosphericIntelligence
from .forecast_service import ForecastResult
from .terrain_factors import TerrainRiskFactors
from .impact_risk import ImpactRisk
from .ground_impact import GroundImpactIntelligence

@dataclass
class UnifiedCellIntelligence:
    cell_id: str
    latitude: float
    longitude: float
    
    # Phase 1 existing intelligence
    atmospheric: GridCellIntelligence
    
    # Phase 2 temporal & forecast (Optional for now as they are generated differently)
    temporal: Optional[AtmosphericIntelligence]
    forecast: Optional[ForecastResult]
    
    # Phase 2 terrain & impact
    terrain: TerrainRiskFactors
    exposure: ImpactRisk
    ground_impact: GroundImpactIntelligence
