from .models import GridCellIntelligence
from .terrain_factors import TerrainRiskFactors
from .impact_risk import ImpactRisk
from .ground_impact import GroundImpactIntelligence, build_ground_impact_intelligence

def build_cell_ground_impact(
    cell_intel: GridCellIntelligence,
    terrain: TerrainRiskFactors,
    exposure: ImpactRisk
) -> GroundImpactIntelligence:
    
    return build_ground_impact_intelligence(
        atmospheric_risk_score=cell_intel.risk.score,
        terrain=terrain,
        impact=exposure
    )
