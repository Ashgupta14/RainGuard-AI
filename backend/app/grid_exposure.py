from .models import GridCellIntelligence
from .impact_exposure import ImpactExposure, build_impact_features
from .impact_risk import ImpactRisk, calculate_impact_risk

def build_cell_exposure(cell_intel: GridCellIntelligence) -> ImpactRisk:
    # Deterministic synthetic values for prototype
    val = (abs(cell_intel.cell.latitude * 5) + abs(cell_intel.cell.longitude * 7)) % 100
    
    exposure = ImpactExposure(
        population_density=(val % 10) / 10.0,
        road_exposure=((val + 2) % 10) / 10.0,
        building_exposure=((val + 4) % 10) / 10.0,
        critical_infrastructure_exposure=((val + 6) % 10) / 10.0,
    )
    
    features = build_impact_features(exposure)
    return calculate_impact_risk(features)
