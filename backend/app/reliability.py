from typing import List

from .models import GridCellIntelligence


def calculate_reliability_summary(
    cells: List[GridCellIntelligence],
) -> dict:
    if not cells:
        return {
            "status": "unavailable",
            "score": 0,
            "message": "No intelligence cells available.",
        }

    reliable_cells = sum(
        cell.risk.is_reliable
        for cell in cells
    )

    coverage = (
        reliable_cells / len(cells)
    ) * 100

    if coverage >= 80:
        status = "high"
    elif coverage >= 50:
        status = "moderate"
    else:
        status = "limited"

    return {
        "status": status,
        "score": round(coverage),
        "message": (
            f"{reliable_cells} of {len(cells)} "
            f"cells meet the current reliability threshold."
        ),
    }
