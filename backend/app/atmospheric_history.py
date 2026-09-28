from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional


@dataclass
class AtmosphericSnapshot:
    timestamp: str

    temperature: Optional[float] = None
    humidity: Optional[float] = None
    pressure: Optional[float] = None
    rainfall: Optional[float] = None

    cape: Optional[float] = None
    cin: Optional[float] = None
    wind_speed: Optional[float] = None
    wind_direction: Optional[float] = None


class AtmosphericHistory:
    """
    Lightweight in-memory history for the Phase 2 prototype.

    This provides temporal context without introducing
    database complexity yet.
    """

    def __init__(
        self,
        max_snapshots: int = 24,
    ) -> None:

        self.max_snapshots = max_snapshots

        self._snapshots: list[
            AtmosphericSnapshot
        ] = []

    def add(
        self,
        snapshot: AtmosphericSnapshot,
    ) -> None:

        self._snapshots.append(
            snapshot
        )

        if len(self._snapshots) > self.max_snapshots:
            self._snapshots = (
                self._snapshots[
                    -self.max_snapshots:
                ]
            )

    def latest(
        self,
    ) -> Optional[AtmosphericSnapshot]:

        if not self._snapshots:
            return None

        return self._snapshots[-1]

    def all(
        self,
    ) -> list[AtmosphericSnapshot]:

        return self._snapshots.copy()

    def clear(self) -> None:
        self._snapshots.clear()


def create_snapshot(
    *,
    temperature: Optional[float] = None,
    humidity: Optional[float] = None,
    pressure: Optional[float] = None,
    rainfall: Optional[float] = None,
    cape: Optional[float] = None,
    cin: Optional[float] = None,
    wind_speed: Optional[float] = None,
    wind_direction: Optional[float] = None,
    timestamp: Optional[str] = None,
) -> AtmosphericSnapshot:

    return AtmosphericSnapshot(
        timestamp=(
            timestamp
            or datetime.now(
                timezone.utc
            ).isoformat()
        ),
        temperature=temperature,
        humidity=humidity,
        pressure=pressure,
        rainfall=rainfall,
        cape=cape,
        cin=cin,
        wind_speed=wind_speed,
        wind_direction=wind_direction,
    )
