from typing import Any

from .grid import (
    MAX_LATITUDE,
    MAX_LONGITUDE,
    MIN_LATITUDE,
    MIN_LONGITUDE,
    GRID_COLUMNS,
    GRID_ROWS,
    build_grid_intelligence,
)
from .live_data_validation import (
    validate_observations,
)
from .live_grid import create_live_grid
from .provider_manager import (
    get_live_provider,
)


def create_grid_coordinates() -> list[
    tuple[float, float]
]:

    coordinates: list[
        tuple[float, float]
    ] = []

    latitude_step = (
        MAX_LATITUDE - MIN_LATITUDE
    ) / GRID_ROWS

    longitude_step = (
        MAX_LONGITUDE - MIN_LONGITUDE
    ) / GRID_COLUMNS

    for row in range(GRID_ROWS):
        for column in range(
            GRID_COLUMNS
        ):

            latitude = (
                MIN_LATITUDE
                + (row + 0.5)
                * latitude_step
            )

            longitude = (
                MIN_LONGITUDE
                + (column + 0.5)
                * longitude_step
            )

            coordinates.append(
                (
                    latitude,
                    longitude,
                )
            )

    return coordinates


def fetch_live_grid() -> dict[str, Any]:

    provider = get_live_provider()

    coordinates = (
        create_grid_coordinates()
    )

    observations = (
        provider.fetch_observations(
            coordinates
        )
    )

    valid_observations, rejected = (
        validate_observations(
            observations
        )
    )

    cells = create_live_grid(
        valid_observations
    )

    intelligent_cells = (
        build_grid_intelligence(
            cells
        )
    )

    return {
        "cells": intelligent_cells,
        "provider": provider.name,
        "observations_received": len(
            observations
        ),
        "observations_valid": len(
            valid_observations
        ),
        "observations_rejected": len(
            rejected
        ),
        "rejected_observations": rejected,
    }
