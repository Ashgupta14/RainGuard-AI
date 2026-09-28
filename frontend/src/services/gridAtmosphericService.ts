import type { AtmosphericProfile } from "./atmosphericTypes";

import {
  calculateIWV,
} from "./iwvService";

import {
  calculateCAPECIN,
} from "./capeService";

import {
  calculateKinematics,
} from "./kinematicsService";

import type {
  GridCell,
} from "./gridTypes";

import type {
  WindObservation,
} from "./kinematicsService";

export interface GridAtmosphericFeatures {
  integratedWaterVapour?: number;

  cape?: number;

  cin?: number;

  windConvergence?: number;

  windShear?: number;
}

interface GridKinematicsInput {
  currentWind?: WindObservation;

  previousWind?: WindObservation;

  nextWind?: WindObservation;
}

/**
 * Calculate atmospheric features for a grid cell.
 *
 * Existing cell values are preserved.
 *
 * An atmospheric profile is only used when a
 * corresponding cell value is not already available.
 */
export function calculateGridAtmosphericFeatures(
  cell: GridCell,
  atmosphericProfile?: AtmosphericProfile,
  kinematicsInput?: GridKinematicsInput
): GridAtmosphericFeatures {

  const features: GridAtmosphericFeatures = {};


  /*
   * -------------------------------------------------------
   * INTEGRATED WATER VAPOUR
   * -------------------------------------------------------
   */

  if (
    cell.integratedWaterVapour !==
    undefined
  ) {

    /*
     * Live/grid-provided value already exists.
     *
     * Preserve it.
     */

    features.integratedWaterVapour =
      cell.integratedWaterVapour;

  } else if (
    atmosphericProfile
  ) {

    /*
     * Fall back to profile calculation.
     *
     * This is primarily used by the demo pipeline.
     */

    const iwvResult =
      calculateIWV(
        atmosphericProfile
      );

    if (
      iwvResult.valid
    ) {

      features.integratedWaterVapour =
        Number(
          iwvResult.value.toFixed(2)
        );
    }
  }


  /*
   * -------------------------------------------------------
   * CAPE / CIN
   * -------------------------------------------------------
   */

  if (
    cell.cape !== undefined
  ) {

    /*
     * Preserve existing grid value.
     */

    features.cape =
      cell.cape;

  } else if (
    atmosphericProfile
  ) {

    const capeCinResult =
      calculateCAPECIN(
        atmosphericProfile
      );

    if (
      capeCinResult.valid
    ) {

      features.cape =
        capeCinResult.cape;

      /*
       * Only use the profile CIN if
       * the cell does not already contain one.
       */

      if (
        cell.cin ===
        undefined
      ) {

        features.cin =
          capeCinResult.cin;
      }
    }
  }


  /*
   * -------------------------------------------------------
   * CIN
   * -------------------------------------------------------
   */

  if (
    cell.cin !== undefined
  ) {

    /*
     * Existing grid CIN always wins.
     */

    features.cin =
      cell.cin;
  }


  /*
   * -------------------------------------------------------
   * OPTIONAL OBSERVATION-BASED KINEMATICS
   * -------------------------------------------------------
   *
   * This remains available for atmospheric
   * observation workflows.
   *
   * Grid-level kinematics are calculated separately
   * by gridKinematicsService.ts.
   */

  if (
    kinematicsInput?.currentWind &&
    kinematicsInput?.previousWind &&
    kinematicsInput?.nextWind
  ) {

    const kinematicsResult =
      calculateKinematics(
        [
          kinematicsInput.previousWind,
          kinematicsInput.currentWind,
          kinematicsInput.nextWind,
        ],

        kinematicsInput.previousWind,

        kinematicsInput.nextWind
      );

    features.windConvergence =
      kinematicsResult.convergence;

    features.windShear =
      kinematicsResult.shear;
  }


  /*
   * -------------------------------------------------------
   * PRESERVE GRID KINEMATICS
   * -------------------------------------------------------
   */

  if (
    cell.windConvergence !==
    undefined
  ) {

    features.windConvergence =
      cell.windConvergence;
  }

  if (
    cell.windShear !==
    undefined
  ) {

    features.windShear =
      cell.windShear;
  }


  return features;
}


/**
 * Enrich a grid cell with atmospheric intelligence.
 */
export function enrichGridCellWithAtmosphericFeatures(
  cell: GridCell,

  atmosphericProfile?: AtmosphericProfile,

  kinematicsInput?: GridKinematicsInput
): GridCell {

  const features =
    calculateGridAtmosphericFeatures(
      cell,
      atmosphericProfile,
      kinematicsInput
    );

  return {
    ...cell,

    ...features,
  };
}
