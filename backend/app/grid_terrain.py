from .models import GridCellIntelligence
from .terrain import TerrainObservation, build_terrain_features
from .terrain_factors import TerrainRiskFactors, calculate_terrain_factors

def build_cell_terrain(cell_intel: GridCellIntelligence) -> TerrainRiskFactors:
    # Synthetic proxy for prototype based on coordinates
    base_val = (abs(cell_intel.cell.latitude * 10) + abs(cell_intel.cell.longitude * 10)) % 100
    
    observation = TerrainObservation(
        latitude=cell_intel.cell.latitude,
        longitude=cell_intel.cell.longitude,
        elevation_m=base_val, # 0 to 100m proxy
        slope_degrees=base_val % 15,
        drainage_score=(base_val % 10) / 10.0,
        flow_accumulation_proxy=(100 - base_val) / 100.0,
    )
    
    features = build_terrain_features(observation)
    return calculate_terrain_factors(features)
