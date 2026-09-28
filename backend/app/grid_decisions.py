from .unified_cell_intelligence import UnifiedCellIntelligence
from .cell_decision import CellDecision, build_cell_decision

def generate_grid_decisions(cells: list[UnifiedCellIntelligence]) -> dict[str, CellDecision]:
    decisions = {}
    for cell in cells:
        decisions[cell.cell_id] = build_cell_decision(cell)
    return decisions
