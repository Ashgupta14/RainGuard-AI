import math
from typing import List

from .models import GridCell


# ---------------------------------------------------------
# DEMO GRID CONFIGURATION
# ---------------------------------------------------------

GRID_ROWS = 30
GRID_COLUMNS = 30

MIN_LATITUDE = 12.90
MAX_LATITUDE = 13.20

MIN_LONGITUDE = 80.05
MAX_LONGITUDE = 80.35


# ---------------------------------------------------------
# SPATIAL FIELD
# ---------------------------------------------------------

def spatial_factor(
    latitude: float,
    longitude: float,
) -> float:
    """
    Create a deterministic spatial pattern for the
    demonstration environment.

    This is synthetic demonstration data.
    """

    latitude_factor = math.sin(
        latitude * 18.0
    )

    longitude_factor = math.cos(
        longitude * 18.0
    )

    return (
        latitude_factor * 0.6
        +
        longitude_factor * 0.4
    )


# ---------------------------------------------------------
# CREATE DEMO GRID DATA
# ---------------------------------------------------------

def create_demo_grid() -> List[GridCell]:
    """
    Generate a complete 30 × 30 demonstration grid.

    Total cells = 900.
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


    for row in range(
        GRID_ROWS
    ):

        for column in range(
            GRID_COLUMNS
        ):

            latitude = (
                MIN_LATITUDE
                +
                (
                    row + 0.5
                )
                *
                latitude_step
            )

            longitude = (
                MIN_LONGITUDE
                +
                (
                    column + 0.5
                )
                *
                longitude_step
            )


            factor = spatial_factor(
                latitude,
                longitude,
            )


            # ------------------------------------------------
            # ATMOSPHERIC VARIABLES
            # ------------------------------------------------

            rainfall = max(
                0.0,
                24.0
                +
                factor * 12.0,
            )


            integrated_water_vapour = max(
                0.0,
                62.0
                +
                factor * 6.0,
            )


            cape = max(
                0.0,
                1200.0
                +
                factor * 600.0,
            )


            cin = max(
                0.0,
                70.0
                -
                factor * 25.0,
            )


            wind_speed = max(
                0.0,
                18.0
                +
                factor * 5.0,
            )


            wind_direction = (
                230.0
                +
                factor * 20.0
            ) % 360.0


            wind_convergence = (
                10.0
                +
                factor * 6.0
            )


            wind_shear = max(
                0.0,
                14.0
                +
                factor * 6.0,
            )


            cells.append(
                GridCell(

                    id=(
                        f"grid-{row}-"
                        f"{column}"
                    ),

                    latitude=
                        latitude,

                    longitude=
                        longitude,

                    # These are derived demonstration
                    # values rather than direct observations.

                    observation_count=1,

                    rainfall=
                        round(
                            rainfall,
                            2,
                        ),

                    temperature=
                        round(
                            28.0
                            +
                            factor * 2.0,
                            2,
                        ),

                    humidity=
                        round(
                            78.0
                            +
                            factor * 8.0,
                            2,
                        ),

                    pressure=
                        round(
                            1004.0
                            +
                            factor * 4.0,
                            2,
                        ),

                    wind_speed=
                        round(
                            wind_speed,
                            2,
                        ),

                    wind_direction=
                        round(
                            wind_direction,
                            2,
                        ),

                    integrated_water_vapour=
                        round(
                            integrated_water_vapour,
                            2,
                        ),

                    cape=
                        round(
                            cape,
                            2,
                        ),

                    cin=
                        round(
                            cin,
                            2,
                        ),

                    wind_convergence=
                        round(
                            wind_convergence,
                            4,
                        ),

                    wind_shear=
                        round(
                            wind_shear,
                            4,
                        ),
                )
            )


    return cells
