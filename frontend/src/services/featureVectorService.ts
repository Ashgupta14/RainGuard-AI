import type { GridCell } from "./gridTypes";

export interface AtmosphericFeatureVector {
  integratedWaterVapour: number | null;

  cape: number | null;

  cin: number | null;

  windConvergence: number | null;

  windShear: number | null;

  rainfall: number | null;

  featureCount: number;

  completeness: number;
}

/**
 * Convert a grid cell's atmospheric information
 * into a structured feature vector for the AI engine.
 *
 * Null means that the feature is not available yet.
 * We never replace missing scientific observations
 * with fabricated values.
 */
export function createAtmosphericFeatureVector(
  cell: GridCell
): AtmosphericFeatureVector {
  const features = {
    integratedWaterVapour:
      cell.integratedWaterVapour ?? null,

    cape: cell.cape ?? null,

    cin: cell.cin ?? null,

    windConvergence:
      cell.windConvergence ?? null,

    windShear:
      cell.windShear ?? null,

    rainfall:
      cell.rainfall ?? null,
  };

  const values = Object.values(features);

  const featureCount = values.filter(
    (value) => value !== null
  ).length;

  const completeness =
    Number(
      (
        featureCount /
        values.length
      ).toFixed(2)
    );

  return {
    ...features,

    featureCount,

    completeness,
  };
}
