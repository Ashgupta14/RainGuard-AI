from dataclasses import dataclass
from datetime import datetime, timezone


@dataclass(frozen=True)
class DataStatus:
    mode: str
    provider: str
    status: str
    fallback_available: bool
    message: str
    generated_at: str


def get_data_status(mode: str = "demo", provider: str = "RainGuard Synthetic Weather Engine", fallback: bool = False) -> DataStatus:
    """
    Returns the current backend data-source status.

    The current Phase 1 prototype intentionally uses
    synthetic/demo observations. This status makes that
    distinction explicit instead of presenting demo data
    as live observations.
    """

    if fallback or mode == "fallback":
        return DataStatus(
            mode="fallback",
            provider=provider,
            status="degraded",
            fallback_available=True,
            message="Live provider unavailable. Demo intelligence active.",
            generated_at=datetime.now(timezone.utc).isoformat(),
        )
    elif mode == "live":
        return DataStatus(
            mode="live",
            provider=provider,
            status="operational",
            fallback_available=True,
            message="Current provider operational",
            generated_at=datetime.now(timezone.utc).isoformat(),
        )

    return DataStatus(
        mode="demo",
        provider="RainGuard Synthetic Weather Engine",
        status="operational",
        fallback_available=True,
        message=(
            "Prototype intelligence is running on "
            "synthetic observations. Live provider "
            "adapters can be connected without changing "
            "the intelligence pipeline."
        ),
        generated_at=datetime.now(timezone.utc).isoformat(),
    )
