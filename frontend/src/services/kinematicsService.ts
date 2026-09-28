import type { AtmosphericLevel } from "./atmosphericTypes";

export interface WindObservation {
  latitude: number;
  longitude: number;
  speed: number;
  direction: number;
}

export interface WindComponents {
  u: number;
  v: number;
}

export interface KinematicsResult {
  meanU: number;
  meanV: number;
  convergence: number;
  shear: number;
  riskLevel: "Low" | "Moderate" | "High";
  valid: boolean;
}


/*
 * ---------------------------------------------------------
 * WIND COMPONENTS
 * ---------------------------------------------------------
 *
 * Meteorological wind direction describes the direction
 * FROM which the wind is blowing.
 *
 * u = east-west component
 * v = north-south component
 */

export function calculateWindComponents(
  speed: number,
  direction: number
): WindComponents {

  const directionRadians =
    (direction * Math.PI) / 180;

  const u =
    -speed * Math.sin(directionRadians);

  const v =
    -speed * Math.cos(directionRadians);

  return {
    u: Number(u.toFixed(3)),
    v: Number(v.toFixed(3)),
  };
}


/*
 * ---------------------------------------------------------
 * HORIZONTAL WIND CONVERGENCE
 * ---------------------------------------------------------
 *
 * For a proper spatial calculation we need winds at
 * multiple locations.
 *
 * This implementation estimates convergence using
 * neighbouring observations.
 */

export function calculateHorizontalConvergence(
  observations: WindObservation[]
): number {

  if (observations.length < 2) {
    return 0;
  }

  let totalConvergence = 0;
  let comparisons = 0;

  for (let i = 0; i < observations.length; i++) {

    const first = observations[i];

    const firstComponents =
      calculateWindComponents(
        first.speed,
        first.direction
      );

    for (let j = i + 1; j < observations.length; j++) {

      const second = observations[j];

      const secondComponents =
        calculateWindComponents(
          second.speed,
          second.direction
        );

      const latitudeDistance =
        second.latitude - first.latitude;

      const longitudeDistance =
        second.longitude - first.longitude;

      const distanceSquared =
        latitudeDistance ** 2 +
        longitudeDistance ** 2;

      if (distanceSquared === 0) {
        continue;
      }

      /*
       * Approximate directional convergence.
       *
       * Positive values indicate winds becoming
       * more convergent between neighbouring points.
       */

      const deltaU =
        secondComponents.u -
        firstComponents.u;

      const deltaV =
        secondComponents.v -
        firstComponents.v;

      const gradient =
        (
          deltaU * longitudeDistance +
          deltaV * latitudeDistance
        ) /
        distanceSquared;

      totalConvergence += -gradient;

      comparisons++;
    }
  }

  if (comparisons === 0) {
    return 0;
  }

  return Number(
    (totalConvergence / comparisons).toFixed(3)
  );
}


/*
 * ---------------------------------------------------------
 * VERTICAL WIND SHEAR
 * ---------------------------------------------------------
 *
 * Shear is the change in wind vector with height.
 *
 * With the current atmospheric profile we do not yet
 * have wind observations at every pressure level.
 *
 * Therefore this function accepts two wind layers.
 */

export function calculateVerticalWindShear(
  lowerWind: WindObservation,
  upperWind: WindObservation
): number {

  const lower =
    calculateWindComponents(
      lowerWind.speed,
      lowerWind.direction
    );

  const upper =
    calculateWindComponents(
      upperWind.speed,
      upperWind.direction
    );

  const deltaU =
    upper.u - lower.u;

  const deltaV =
    upper.v - lower.v;

  const shear =
    Math.sqrt(
      deltaU ** 2 +
      deltaV ** 2
    );

  return Number(shear.toFixed(2));
}


/*
 * ---------------------------------------------------------
 * KINEMATIC RISK
 * ---------------------------------------------------------
 */

function determineRiskLevel(
  convergence: number,
  shear: number
): "Low" | "Moderate" | "High" {

  /*
   * These thresholds are demonstration thresholds.
   *
   * They should be calibrated against the final
   * meteorological data and validation dataset.
   */

  if (
    convergence >= 0.8 ||
    shear >= 20
  ) {
    return "High";
  }

  if (
    convergence >= 0.3 ||
    shear >= 10
  ) {
    return "Moderate";
  }

  return "Low";
}


/*
 * ---------------------------------------------------------
 * COMPLETE KINEMATICS CALCULATION
 * ---------------------------------------------------------
 */

export function calculateKinematics(
  observations: WindObservation[],
  lowerWind: WindObservation,
  upperWind: WindObservation
): KinematicsResult {

  if (observations.length === 0) {

    return {
      meanU: 0,
      meanV: 0,
      convergence: 0,
      shear: 0,
      riskLevel: "Low",
      valid: false,
    };
  }

  const components =
    observations.map(
      (observation) =>
        calculateWindComponents(
          observation.speed,
          observation.direction
        )
    );

  const meanU =
    components.reduce(
      (sum, item) => sum + item.u,
      0
    ) / components.length;

  const meanV =
    components.reduce(
      (sum, item) => sum + item.v,
      0
    ) / components.length;

  const convergence =
    calculateHorizontalConvergence(
      observations
    );

  const shear =
    calculateVerticalWindShear(
      lowerWind,
      upperWind
    );

  return {
    meanU: Number(meanU.toFixed(2)),
    meanV: Number(meanV.toFixed(2)),
    convergence,
    shear,
    riskLevel: determineRiskLevel(
      convergence,
      shear
    ),
    valid: true,
  };
}