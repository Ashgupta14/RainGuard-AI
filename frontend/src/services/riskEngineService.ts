import type { AtmosphericFeatureVector } from "./featureVectorService";

export type RiskLevel =
  | "Low"
  | "Moderate"
  | "High"
  | "Critical";

export interface RiskEngineResult {
  score: number;
  level: RiskLevel;
  contributingFactors: string[];
  featureCompleteness: number;
  isReliable: boolean;
}

function normalize(
  value: number,
  minimum: number,
  maximum: number
): number {
  if (maximum <= minimum) {
    return 0;
  }

  const normalized =
    ((value - minimum) /
      (maximum - minimum)) *
    100;

  return Math.max(
    0,
    Math.min(100, normalized)
  );
}

function getRiskLevel(
  score: number
): RiskLevel {
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

export function calculateFloodRisk(
  features: AtmosphericFeatureVector
): RiskEngineResult {

  let rainfallRisk = 0;
  let atmosphericRisk = 0;
  let kinematicRisk = 0;

  let rainfallAvailable = false;
  let atmosphericAvailable = false;
  let kinematicsAvailable = false;

  const contributingFactors: string[] = [];

  /*
   * --------------------------------------------------
   * 1. IMMEDIATE RAINFALL RISK
   * --------------------------------------------------
   */

  if (
    features.rainfall !== null
  ) {
    rainfallAvailable = true;

    rainfallRisk =
      normalize(
        features.rainfall,
        0,
        50
      );

    if (
      rainfallRisk >= 80
    ) {
      contributingFactors.push(
        "Very heavy rainfall activity"
      );
    } else if (
      rainfallRisk >= 60
    ) {
      contributingFactors.push(
        "Heavy rainfall activity"
      );
    }
  }


  /*
   * --------------------------------------------------
   * 2. ATMOSPHERIC MOISTURE + INSTABILITY
   * --------------------------------------------------
   */

  let atmosphericComponents = 0;
  let atmosphericComponentCount = 0;

  if (
    features.integratedWaterVapour !== null
  ) {
    const moistureRisk =
      normalize(
        features.integratedWaterVapour,
        20,
        70
      );

    atmosphericComponents +=
      moistureRisk;

    atmosphericComponentCount++;

    if (
      moistureRisk >= 60
    ) {
      contributingFactors.push(
        "High atmospheric moisture"
      );
    }
  }

  if (
    features.cape !== null
  ) {
    const capeRisk =
      normalize(
        features.cape,
        0,
        2500
      );

    atmosphericComponents +=
      capeRisk;

    atmosphericComponentCount++;

    if (
      capeRisk >= 60
    ) {
      contributingFactors.push(
        "Elevated atmospheric instability"
      );
    }
  }

  if (
    features.cin !== null
  ) {
    const cinRisk =
      100 -
      normalize(
        Math.abs(
          features.cin
        ),
        0,
        200
      );

    atmosphericComponents +=
      cinRisk;

    atmosphericComponentCount++;

    if (
      cinRisk >= 60
    ) {
      contributingFactors.push(
        "Weak convective inhibition"
      );
    }
  }

  if (
    atmosphericComponentCount > 0
  ) {
    atmosphericAvailable = true;

    atmosphericRisk =
      atmosphericComponents /
      atmosphericComponentCount;
  }


  /*
   * --------------------------------------------------
   * 3. KINEMATIC SUPPORT
   * --------------------------------------------------
   */

  let kinematicComponents = 0;
  let kinematicComponentCount = 0;

  if (
    features.windConvergence !== null
  ) {
    const convergenceRisk =
      normalize(
        Math.abs(
          features.windConvergence
        ),
        0,
        20
      );

    kinematicComponents +=
      convergenceRisk;

    kinematicComponentCount++;

    if (
      convergenceRisk >= 60
    ) {
      contributingFactors.push(
        "Strong wind convergence"
      );
    }
  }

  if (
    features.windShear !== null
  ) {
    const shearRisk =
      normalize(
        features.windShear,
        0,
        30
      );

    kinematicComponents +=
      shearRisk;

    kinematicComponentCount++;

    if (
      shearRisk >= 60
    ) {
      contributingFactors.push(
        "Elevated wind shear"
      );
    }
  }

  if (
    kinematicComponentCount > 0
  ) {
    kinematicsAvailable = true;

    kinematicRisk =
      kinematicComponents /
      kinematicComponentCount;
  }


  /*
   * --------------------------------------------------
   * 4. DYNAMIC WEIGHTING
   * --------------------------------------------------
   *
   * Immediate rainfall receives the strongest
   * influence because flood impact is directly
   * related to precipitation.
   *
   * Atmospheric conditions provide predictive
   * context.
   *
   * Kinematics provide additional storm support.
   */

  let weightedScore = 0;
  let totalWeight = 0;

  if (
    rainfallAvailable
  ) {
    weightedScore +=
      rainfallRisk *
      0.50;

    totalWeight += 0.50;
  }

  if (
    atmosphericAvailable
  ) {
    weightedScore +=
      atmosphericRisk *
      0.30;

    totalWeight += 0.30;
  }

  if (
    kinematicsAvailable
  ) {
    weightedScore +=
      kinematicRisk *
      0.20;

    totalWeight += 0.20;
  }


  const score =
    totalWeight > 0
      ? weightedScore /
        totalWeight
      : 0;

  const roundedScore =
    Math.round(
      Math.max(
        0,
        Math.min(
          100,
          score
        )
      )
    );

  const level =
    getRiskLevel(
      roundedScore
    );


  /*
   * --------------------------------------------------
   * 5. DATA RELIABILITY
   * --------------------------------------------------
   */

  const isReliable =
    features.completeness >=
    0.5;


  /*
   * If no specific factor crossed
   * a meaningful threshold, still
   * provide a useful explanation.
   */

  if (
    contributingFactors.length === 0 &&
    roundedScore < 30
  ) {
    contributingFactors.push(
      "No major atmospheric risk drivers detected"
    );
  }


  return {
    score:
      roundedScore,

    level,

    contributingFactors,

    featureCompleteness:
      features.completeness,

    isReliable,
  };
}
