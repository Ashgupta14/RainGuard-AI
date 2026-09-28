import os

from .live_provider import (
    LiveWeatherProvider,
)
from .open_meteo_provider import (
    OpenMeteoProvider,
)
from .config import settings


def get_active_data_mode() -> str:
    if settings.data_mode in {
        "live",
        "demo",
    }:
        return settings.data_mode

    return "demo"


def get_live_provider() -> LiveWeatherProvider:
    return OpenMeteoProvider()
