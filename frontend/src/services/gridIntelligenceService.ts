import type { AtmosphericProfile } from "./atmosphericTypes";

import {
  calculateGridKinematics,
} from "./gridKinematicsService";

import type {
  WeatherGrid,
  GridCell,
} from "./gridTypes";

import {
  enrichGridCellWithAtmosphericFeatures,
} from "./gridAtmosphericService";

import {
  createAtmosphericFeatureVector,
  type AtmosphericFeatureVector,
} from "./featureVectorService";

import {
  calculateFloodRisk,
  type RiskEngineResult,
} from "./riskEngineService";

import {
  predictHazards,
  type MultiHazardPrediction,
} from "./hazardPredictionService";

import {
  createDemoGridAtmosphericProfile,
} from "./demoGridAtmosphere";


export interface GridCellIntelligence {

  cell: GridCell;

  features: AtmosphericFeatureVector;

  floodRisk: RiskEngineResult;

  hazards: MultiHazardPrediction;
}


export interface IntelligentWeatherGrid {

  rows: number;

  columns: number;

  minLatitude: number;

  maxLatitude: number;

  minLongitude: number;

  maxLongitude: number;

  cells: GridCellIntelligence[];
}


/*
 * ---------------------------------------------------------
 * BUILD GRID INTELLIGENCE
 * ---------------------------------------------------------
 *
 * Important:
 *
 * Existing atmospheric values on a grid cell are preserved.
 *
 * A synthetic demo atmospheric profile is used only when
 * the cell does not already contain atmospheric values.
 *
 * This prevents live IWV / CAPE / CIN data from being
 * overwritten by demonstration values.
 * ---------------------------------------------------------
 */

export function buildGridIntelligence(
  grid: WeatherGrid,
  atmosphericProfile?: AtmosphericProfile
): IntelligentWeatherGrid {

  /*
   * Calculate spatial wind convergence
   * and wind shear before running the
   * atmospheric intelligence engine.
   */

  const kinematicGrid =
    calculateGridKinematics(
      grid
    );


  const intelligentCells =
    kinematicGrid.cells.map(
      (cell) => {

        /*
         * -------------------------------------------------
         * ATMOSPHERIC PROFILE
         * -------------------------------------------------
         *
         * If an explicit profile is supplied, use it.
         *
         * Otherwise, only create a demo profile when the
         * grid cell itself does not already contain the
         * atmospheric values.
         */

        const hasExistingAtmosphericData =
          cell.integratedWaterVapour !== undefined ||
          cell.cape !== undefined ||
          cell.cin !== undefined;


        const cellAtmosphericProfile =
          atmosphericProfile ??
          (
            hasExistingAtmosphericData
              ? undefined
              : createDemoGridAtmosphericProfile(
                  cell
                )
          );


        /*
         * -------------------------------------------------
         * ENRICH CELL
         * -------------------------------------------------
         */

        const enrichedCell =
          enrichGridCellWithAtmosphericFeatures(
            cell,
            cellAtmosphericProfile
          );


        /*
         * -------------------------------------------------
         * FEATURE VECTOR
         * -------------------------------------------------
         */

        const features =
          createAtmosphericFeatureVector(
            enrichedCell
          );


        /*
         * -------------------------------------------------
         * FLOOD RISK
         * -------------------------------------------------
         */

        const floodRisk =
          calculateFloodRisk(
            features
          );


        /*
         * -------------------------------------------------
         * MULTI-HAZARD PREDICTION
         * -------------------------------------------------
         */

        const hazards =
          predictHazards(
            features
          );


        return {

          cell:
            enrichedCell,

          features,

          floodRisk,

          hazards,

        };

      }
    );


  /*
   * -------------------------------------------------------
   * RETURN INTELLIGENT GRID
   * -------------------------------------------------------
   */

  return {

    rows:
      grid.rows,

    columns:
      grid.columns,

    minLatitude:
      grid.minLatitude,

    maxLatitude:
      grid.maxLatitude,

    minLongitude:
      grid.minLongitude,

    maxLongitude:
      grid.maxLongitude,

    cells:
      intelligentCells,

  };

}
