from datetime import datetime, timezone
from typing import Optional

from .live_provider import LiveObservation


MAX_OBSERVATION_AGE_MINUTES = 30


def validate_observation(
    observation: LiveObservation,
) -> tuple[bool, list[str]]:

    errors: list[str] = []

    if not (
        -90 <= observation.latitude <= 90
    ):
        errors.append(
            "Invalid latitude."
        )

    if not (
        -180 <= observation.longitude <= 180
    ):
        errors.append(
            "Invalid longitude."
        )

    if observation.temperature is not None:
        if not (
            -80 <= observation.temperature <= 70
        ):
            errors.append(
                "Temperature outside expected range."
            )

    if observation.humidity is not None:
        if not (
            0 <= observation.humidity <= 100
        ):
            errors.append(
                "Humidity outside expected range."
            )

    if observation.rainfall is not None:
        if observation.rainfall < 0:
            errors.append(
                "Rainfall cannot be negative."
            )

    if observation.wind_speed is not None:
        if observation.wind_speed < 0:
            errors.append(
                "Wind speed cannot be negative."
            )

    if observation.timestamp:
        try:
            timestamp = datetime.fromisoformat(
                observation.timestamp.replace(
                    "Z",
                    "+00:00",
                )
            )

            age_minutes = (
                datetime.now(timezone.utc)
                - timestamp
            ).total_seconds() / 60

            if age_minutes < -5:
                errors.append(
                    "Observation timestamp is in the future."
                )

            elif (
                age_minutes
                > MAX_OBSERVATION_AGE_MINUTES
            ):
                errors.append(
                    "Observation is stale."
                )

        except ValueError:
            errors.append(
                "Invalid observation timestamp."
            )

    return (
        len(errors) == 0,
        errors,
    )


def validate_observations(
    observations: list[LiveObservation],
) -> tuple[
    list[LiveObservation],
    list[dict],
]:

    valid: list[LiveObservation] = []
    rejected: list[dict] = []

    for observation in observations:
        is_valid, errors = (
            validate_observation(
                observation
            )
        )

        if is_valid:
            valid.append(observation)
        else:
            rejected.append(
                {
                    "latitude": observation.latitude,
                    "longitude": observation.longitude,
                    "provider": observation.provider,
                    "errors": errors,
                }
            )

    return valid, rejected
