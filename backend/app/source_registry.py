from dataclasses import dataclass


@dataclass(frozen=True)
class SourceDefinition:
    name: str
    source_type: str
    status: str
    description: str


SOURCE_REGISTRY = [
    SourceDefinition(
        name="Open-Meteo",
        source_type="weather-model",
        status="available",
        description=(
            "Live atmospheric and surface "
            "weather observations."
        ),
    ),
    SourceDefinition(
        name="IMD",
        source_type="official-meteorological",
        status="planned",
        description=(
            "Official India meteorological "
            "observation and forecast source."
        ),
    ),
    SourceDefinition(
        name="Weather Radar",
        source_type="radar",
        status="planned",
        description=(
            "Radar-based precipitation and "
            "storm structure intelligence."
        ),
    ),
    SourceDefinition(
        name="INSAT",
        source_type="satellite",
        status="planned",
        description=(
            "Satellite-derived cloud and "
            "atmospheric observations."
        ),
    ),
    SourceDefinition(
        name="Weather Stations",
        source_type="station",
        status="planned",
        description=(
            "Ground-based weather observations."
        ),
    ),
    SourceDefinition(
        name="NWP",
        source_type="numerical-weather-model",
        status="planned",
        description=(
            "Numerical weather prediction "
            "background fields."
        ),
    ),
]


def get_source_registry() -> list[
    SourceDefinition
]:
    return SOURCE_REGISTRY.copy()
