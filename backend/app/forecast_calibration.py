from dataclasses import dataclass


@dataclass
class CalibratedForecast:
    raw_score: int
    calibrated_score: int
    confidence: int
    calibration_method: str


def calibrate_forecast(
    raw_score: int,
    confidence: int,
) -> CalibratedForecast:

    raw_score = max(
        0,
        min(
            raw_score,
            100,
        ),
    )

    confidence = max(
        0,
        min(
            confidence,
            100,
        ),
    )

    # Phase 2 prototype calibration.
    #
    # We intentionally keep the raw score visible and
    # do not claim probabilistic calibration until a
    # trained model has been evaluated against historical
    # observations.

    calibrated_score = round(
        raw_score
        * (
            0.7
            + 0.3
            * confidence
            / 100
        )
    )

    return CalibratedForecast(
        raw_score=raw_score,
        calibrated_score=calibrated_score,
        confidence=confidence,
        calibration_method=(
            "prototype-confidence-adjustment"
        ),
    )
