from dataclasses import dataclass

from .forecast_features import (
    ForecastFeatureVector,
)


@dataclass
class ForecastPrediction:
    risk_score: int
    level: str
    confidence: int
    model_name: str
    is_trained_model: bool
    explanation: list[str]


class ForecastModel:
    """
    Contract for all future RainGuard forecasting models.

    Examples:
    - XGBoost
    - LightGBM
    - CNN
    - ConvLSTM
    """

    name: str = "unknown"

    is_trained_model: bool = False

    def predict(
        self,
        features: ForecastFeatureVector,
    ) -> ForecastPrediction:

        raise NotImplementedError
