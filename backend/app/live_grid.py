from typing import Optional

from .grid import (
    GRID_COLUMNS,
    GRID_ROWS,
    MAX_LATITUDE,
    MAX_LONGITUDE,
    MIN_LATITUDE,
    MIN_LONGITUDE,
)
from .live_provider import (
    LiveObservation,
)
from .models import GridCell


def create_live_grid(
    observations: list[LiveObservation],
) -> list[GridCell]:

    lat_step = (
        MAX_LATITUDE - MIN_LATITUDE
    ) / GRID_ROWS

    lon_step = (
        MAX_LONGITUDE - MIN_LONGITUDE
    ) / GRID_COLUMNS

    cells: list[GridCell] = []

    buckets: dict[
        tuple[int, int],
        list[LiveObservation],
    ] = {}

    for observation in observations:

        if not (
            MIN_LATITUDE
            <= observation.latitude
            <= MAX_LATITUDE
        ):
            continue

        if not (
            MIN_LONGITUDE
            <= observation.longitude
            <= MAX_LONGITUDE
        ):
            continue

        row = min(
            int(
                (
                    observation.latitude
                    - MIN_LATITUDE
                )
                / lat_step
            ),
            GRID_ROWS - 1,
        )

        column = min(
            int(
                (
                    observation.longitude
                    - MIN_LONGITUDE
                )
                / lon_step
            ),
            GRID_COLUMNS - 1,
        )

        buckets.setdefault(
            (row, column),
            [],
        ).append(observation)

    for row in range(GRID_ROWS):
        for column in range(GRID_COLUMNS):

            min_latitude = (
                MIN_LATITUDE
                + row * lat_step
            )

            max_latitude = (
                min_latitude
                + lat_step
            )

            min_longitude = (
                MIN_LONGITUDE
                + column * lon_step
            )

            max_longitude = (
                min_longitude
                + lon_step
            )

            center_latitude = (
                min_latitude
                + max_latitude
            ) / 2

            center_longitude = (
                min_longitude
                + max_longitude
            ) / 2

            bucket = buckets.get(
                (row, column),
                [],
            )

            cells.append(
                _build_cell(
                    row=row,
                    column=column,
                    center_latitude=center_latitude,
                    center_longitude=center_longitude,
                    min_latitude=min_latitude,
                    max_latitude=max_latitude,
                    min_longitude=min_longitude,
                    max_longitude=max_longitude,
                    observations=bucket,
                )
            )

    return cells


def _average(
    values: list[Optional[float]],
) -> Optional[float]:

    valid = [
        value
        for value in values
        if value is not None
    ]

    if not valid:
        return None

    return sum(valid) / len(valid)


def _build_cell(
    row: int,
    column: int,
    center_latitude: float,
    center_longitude: float,
    min_latitude: float,
    max_latitude: float,
    min_longitude: float,
    max_longitude: float,
    observations: list[LiveObservation],
) -> GridCell:

    return GridCell(
        id=f"grid-{row}-{column}",
        latitude=center_latitude,
        longitude=center_longitude,
        observation_count=len(
            observations
        ),
        temperature=_average(
            [
                item.temperature
                for item in observations
            ]
        ),
        humidity=_average(
            [
                item.humidity
                for item in observations
            ]
        ),
        pressure=_average(
            [
                item.pressure
                for item in observations
            ]
        ),
        rainfall=_average(
            [
                item.rainfall
                for item in observations
            ]
        ),
        wind_speed=_average(
            [
                item.wind_speed
                for item in observations
            ]
        ),
        wind_direction=_average(
            [
                item.wind_direction
                for item in observations
            ]
        ),
        cape=_average(
            [
                item.cape
                for item in observations
            ]
        ),
        cin=_average(
            [
                item.cin
                for item in observations
            ]
        ),
    )
