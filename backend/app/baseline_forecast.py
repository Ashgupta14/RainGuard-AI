from .forecast_features import (
    ForecastFeatureVector,
)
from .forecast_model import (
    ForecastModel,
    ForecastPrediction,
)


class BaselineForecastModel(
    ForecastModel
):
    name = "Rule-Based Forecast Baseline"
    is_trained_model = False

    def predict(
        self,
        features: ForecastFeatureVector,
    ) -> ForecastPrediction:

        score = 0
        explanation: list[str] = []

        if (
            features.rainfall is not None
            and features.rainfall >= 20
        ):
            score += 30
            explanation.append(
                "Current rainfall intensity is elevated."
            )

        if (
            features.rainfall_change is not None
            and features.rainfall_change >= 5
        ):
            score += 25
            explanation.append(
                "Rainfall intensity is increasing."
            )

        if (
            features.cape is not None
            and features.cape >= 2500
        ):
            score += 20
            explanation.append(
                "Atmospheric instability is elevated."
            )

        if (
            features.cape_change is not None
            and features.cape_change >= 500
        ):
            score += 10
            explanation.append(
                "Atmospheric instability is increasing."
            )

        if (
            features.humidity is not None
            and features.humidity >= 75
        ):
            score += 10
            explanation.append(
                "Atmospheric moisture is elevated."
            )

        if (
            features.pressure_change is not None
            and features.pressure_change <= -2
        ):
            score += 5
            explanation.append(
                "Surface pressure is falling."
            )

        score = min(
            score,
            100,
        )

        if score >= 80:
            level = "Critical"
        elif score >= 60:
            level = "High"
        elif score >= 30:
            level = "Moderate"
        else:
            level = "Low"

        confidence = round(
            features.completeness * 100
        )

        return ForecastPrediction(
            risk_score=score,
            level=level,
            confidence=confidence,
            model_name=self.name,
            is_trained_model=False,
            explanation=explanation,
        )
