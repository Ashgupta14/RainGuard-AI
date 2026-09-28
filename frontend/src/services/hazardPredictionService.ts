import type { AtmosphericFeatureVector } from "./featureVectorService";
import {
  calculateFloodRisk,
  type RiskEngineResult,
} from "./riskEngineService";

export type HazardType =
  | "Heavy Rain"
  | "Flash Flood"
  | "Severe Weather";

export interface HazardPrediction {
  type: HazardType;

  score: number;

  level:
    | "Low"
    | "Moderate"
    | "High"
    | "Critical";

  confidence: number;

  reason: string;
}

export interface MultiHazardPrediction {
  floodRisk: RiskEngineResult;

  hazards: HazardPrediction[];

  overallRiskScore: number;

  overallLevel:
    | "Low"
    | "Moderate"
    | "High"
    | "Critical";
}

/**
 * Convert a 0–100 score into a risk level.
 */
function getLevel(
  score: number
): HazardPrediction["level"] {
  if (score >= 80) {
    return "Critical";
  }

  if (score >= 60) {
    return "High";
  }

  if (score >= 30) {
    return "Moderate";
  }

  return "Low";
}

/**
 * Calculate Heavy Rain hazard score.
 */
function calculateHeavyRainScore(
  features: AtmosphericFeatureVector
): number {
  const rainfallScore =
    features.rainfall !== null
      ? Math.min(
          100,
          (features.rainfall / 50) * 100
        )
      : 0;

  const moistureScore =
    features.integratedWaterVapour !== null
      ? Math.min(
          100,
          (features.integratedWaterVapour / 70) *
            100
        )
      : 0;

  return Math.round(
    rainfallScore * 0.75 +
      moistureScore * 0.25
  );
}

/**
 * Calculate Flash Flood hazard score.
 *
 * Flash-flood risk emphasizes rainfall,
 * atmospheric moisture and convergence.
 */
function calculateFlashFloodScore(
  features: AtmosphericFeatureVector
): number {
  const rainfallScore =
    features.rainfall !== null
      ? Math.min(
          100,
          (features.rainfall / 50) * 100
        )
      : 0;

  const moistureScore =
    features.integratedWaterVapour !== null
      ? Math.min(
          100,
          (features.integratedWaterVapour / 70) *
            100
        )
      : 0;

  const convergenceScore =
    features.windConvergence !== null
      ? Math.min(
          100,
          (Math.abs(
            features.windConvergence
          ) / 20) * 100
        )
      : 0;

  return Math.round(
    rainfallScore * 0.55 +
      moistureScore * 0.25 +
      convergenceScore * 0.20
  );
}

/**
 * Calculate Severe Weather score.
 *
 * Severe-weather risk emphasizes instability,
 * wind convergence and wind shear.
 */
function calculateSevereWeatherScore(
  features: AtmosphericFeatureVector
): number {
  const capeScore =
    features.cape !== null
      ? Math.min(
          100,
          (features.cape / 2500) * 100
        )
      : 0;

  const cinScore =
    features.cin !== null
      ? Math.max(
          0,
          Math.min(
            100,
            100 -
              (Math.abs(
                features.cin
              ) / 200) *
                100
          )
        )
      : 0;

  const convergenceScore =
    features.windConvergence !== null
      ? Math.min(
          100,
          (Math.abs(
            features.windConvergence
          ) / 20) * 100
        )
      : 0;

  const shearScore =
    features.windShear !== null
      ? Math.min(
          100,
          (features.windShear / 30) * 100
        )
      : 0;

  return Math.round(
    capeScore * 0.35 +
      cinScore * 0.15 +
      convergenceScore * 0.20 +
      shearScore * 0.30
  );
}

/**
 * Calculate confidence from feature completeness.
 *
 * This is prototype confidence based on data availability,
 * not a calibrated ML probability.
 */
function calculateConfidence(
  completeness: number
): number {
  return Math.round(
    Math.max(
      0,
      Math.min(100, completeness * 100)
    )
  );
}

/**
 * Generate a reason for the predicted hazard.
 */
function createReason(
  type: HazardType,
  score: number
): string {
  if (score < 30) {
    return `${type} indicators remain limited.`;
  }

  if (score < 60) {
    return `${type} indicators are increasing and require monitoring.`;
  }

  if (score < 80) {
    return `${type} indicators show elevated atmospheric risk.`;
  }

  return `${type} indicators show a significant atmospheric threat.`;
}

/**
 * Generate multi-hazard predictions from the
 * current atmospheric feature vector.
 */
export function predictHazards(
  features: AtmosphericFeatureVector
): MultiHazardPrediction {
  const floodRisk =
    calculateFloodRisk(features);

  const confidence =
    calculateConfidence(
      features.completeness
    );

  const heavyRainScore =
    calculateHeavyRainScore(
      features
    );

  const flashFloodScore =
    calculateFlashFloodScore(
      features
    );

  const severeWeatherScore =
    calculateSevereWeatherScore(
      features
    );

  const hazards: HazardPrediction[] = [
    {
      type: "Heavy Rain",
      score: heavyRainScore,
      level: getLevel(
        heavyRainScore
      ),
      confidence,
      reason: createReason(
        "Heavy Rain",
        heavyRainScore
      ),
    },

    {
      type: "Flash Flood",
      score: flashFloodScore,
      level: getLevel(
        flashFloodScore
      ),
      confidence,
      reason: createReason(
        "Flash Flood",
        flashFloodScore
      ),
    },

    {
      type: "Severe Weather",
      score: severeWeatherScore,
      level: getLevel(
        severeWeatherScore
      ),
      confidence,
      reason: createReason(
        "Severe Weather",
        severeWeatherScore
      ),
    },
  ];

  const overallRiskScore =
    Math.max(
      floodRisk.score,
      ...hazards.map(
        (hazard) => hazard.score
      )
    );

  return {
    floodRisk,

    hazards,

    overallRiskScore,

    overallLevel:
      getLevel(overallRiskScore),
  };
}
