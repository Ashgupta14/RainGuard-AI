from typing import List, Optional

from .models import (
    GridCell,
    GridCellIntelligence,
)

from .intelligence import (
    build_cell_intelligence,
)


# ---------------------------------------------------------
# GRID CONFIGURATION
# ---------------------------------------------------------

from .config import settings

GRID_ROWS = settings.grid_rows
GRID_COLUMNS = settings.grid_cols

MIN_LATITUDE = 12.90
MAX_LATITUDE = 13.20

MIN_LONGITUDE = 80.05
MAX_LONGITUDE = 80.35


# ---------------------------------------------------------
# CREATE EMPTY GRID
# ---------------------------------------------------------

def create_empty_grid() -> List[GridCell]:
    """
    Create the 30 × 30 spatial grid.

    30 × 30 = 900 cells.
    """

    cells: List[GridCell] = []

    latitude_step = (
        MAX_LATITUDE -
        MIN_LATITUDE
    ) / GRID_ROWS

    longitude_step = (
        MAX_LONGITUDE -
        MIN_LONGITUDE
    ) / GRID_COLUMNS


    for row in range(GRID_ROWS):

        for column in range(
            GRID_COLUMNS
        ):

            min_latitude = (
                MIN_LATITUDE +
                row *
                latitude_step
            )

            max_latitude = (
                min_latitude +
                latitude_step
            )

            min_longitude = (
                MIN_LONGITUDE +
                column *
                longitude_step
            )

            max_longitude = (
                min_longitude +
                longitude_step
            )


            center_latitude = (
                min_latitude +
                max_latitude
            ) / 2

            center_longitude = (
                min_longitude +
                max_longitude
            ) / 2


            cells.append(
                GridCell(

                    id=(
                        f"grid-{row}-"
                        f"{column}"
                    ),

                    latitude=
                        center_latitude,

                    longitude=
                        center_longitude,

                    observation_count=0,
                )
            )


    return cells


# ---------------------------------------------------------
# APPLY INTELLIGENCE
# ---------------------------------------------------------

def build_grid_intelligence(
    cells: List[GridCell],
) -> List[GridCellIntelligence]:
    """
    Run the RainGuard intelligence engine
    for every grid cell.
    """

    return [
        build_cell_intelligence(
            cell
        )
        for cell in cells
    ]
