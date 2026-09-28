from dataclasses import dataclass
from typing import Optional

from .atmospheric_history import (
    AtmosphericSnapshot,
)
from .forecast_features import (
    ForecastFeatureVector,
    build_forecast_features,
)
from .forecast_model import (
    ForecastPrediction,
)
from .baseline_forecast import (
    BaselineForecastModel,
)
from .forecast_calibration import (
    CalibratedForecast,
    calibrate_forecast,
)
from .temporal_features import (
    calculate_temporal_features,
)


@dataclass
class ForecastResult:
    features: ForecastFeatureVector
    prediction: ForecastPrediction
    calibration: CalibratedForecast


def generate_forecast(
    current: AtmosphericSnapshot,
    previous: Optional[
        AtmosphericSnapshot
    ] = None,
) -> ForecastResult:

    temporal = (
        calculate_temporal_features(
            current,
            previous,
        )
    )

    features = build_forecast_features(
        current,
        temporal,
    )

    model = BaselineForecastModel()

    prediction = model.predict(
        features
    )

    calibration = calibrate_forecast(
        prediction.risk_score,
        prediction.confidence,
    )

    return ForecastResult(
        features=features,
        prediction=prediction,
        calibration=calibration,
    )
