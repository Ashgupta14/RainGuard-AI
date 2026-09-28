from .grid import MIN_LATITUDE, MAX_LATITUDE, MIN_LONGITUDE, MAX_LONGITUDE, GRID_ROWS, GRID_COLUMNS
from .models import GridCellIntelligence
from typing import List

def find_cell_for_location(latitude: float, longitude: float, grid_cells: List[GridCellIntelligence]) -> GridCellIntelligence:
    closest_cell = None
    min_dist = float('inf')
    
    for cell in grid_cells:
        dist = (cell.cell.latitude - latitude)**2 + (cell.cell.longitude - longitude)**2
        if dist < min_dist:
            min_dist = dist
            closest_cell = cell
            
    return closest_cell
