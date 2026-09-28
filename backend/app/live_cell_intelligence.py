from typing import List
from .models import GridCell
from .grid import build_grid_intelligence
from .grid_terrain import build_cell_terrain
from .grid_exposure import build_cell_exposure
from .grid_ground_impact import build_cell_ground_impact
from .unified_cell_intelligence import UnifiedCellIntelligence

def process_live_cells(grid_cells: List[GridCell]) -> List[UnifiedCellIntelligence]:
    atmospheric_cells = build_grid_intelligence(grid_cells)
    unified_cells = []
    
    for cell in atmospheric_cells:
        terrain = build_cell_terrain(cell)
        exposure = build_cell_exposure(cell)
        impact = build_cell_ground_impact(cell, terrain, exposure)
        
        unified = UnifiedCellIntelligence(
            cell_id=cell.cell.id,
            latitude=cell.cell.latitude,
            longitude=cell.cell.longitude,
            atmospheric=cell,
            temporal=None,
            forecast=None,
            terrain=terrain,
            exposure=exposure,
            ground_impact=impact
        )
        unified_cells.append(unified)
        
    return unified_cells
