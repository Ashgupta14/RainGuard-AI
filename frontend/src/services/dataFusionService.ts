import type {
  DataAdapterResult,
  DataQuality,
  ObservationSource,
} from "./weatherTypes";

/* =========================================================
   FUSED DATA TYPES
   ========================================================= */

export interface FusedWeatherData<T> {
  data: T;
  sources: ObservationSource[];
  quality: DataQuality;
  timestamp: string;
}


/* =========================================================
   QUALITY HELPERS
   ========================================================= */

function calculateCombinedQuality(
  results: DataAdapterResult<unknown>[]
): DataQuality {

  if (results.length === 0) {
    return {
      source: "demo",
      timestamp: new Date().toISOString(),
      qualityScore: 0,
      isValid: false,
      missingFields: [],
    };
  }

  const totalQuality = results.reduce(
    (sum, result) => sum + result.quality.qualityScore,
    0
  );

  const averageQuality =
    totalQuality / results.length;

  const missingFields = Array.from(
    new Set(
      results.flatMap(
        (result) => result.quality.missingFields
      )
    )
  );

  const sources = results.map(
    (result) => result.source
  );

  return {
    source:
      sources.length === 1
        ? sources[0]
        : "demo",

    timestamp: new Date().toISOString(),

    qualityScore: Number(
      averageQuality.toFixed(2)
    ),

    isValid:
      results.every(
        (result) => result.quality.isValid
      ) && averageQuality >= 0.5,

    missingFields,
  };
}


/* =========================================================
   FUSE ADAPTER RESULTS
   ========================================================= */

export function fuseWeatherData<T>(
  results: DataAdapterResult<T>[]
): FusedWeatherData<T> {

  if (results.length === 0) {
    throw new Error(
      "Cannot perform data fusion without data sources."
    );
  }

  /*
   * For the first implementation we use the
   * highest-quality valid observation as the
   * representative dataset.
   *
   * Later this function will perform actual
   * field-level fusion between:
   *
   * Satellite
   * Radar
   * Weather Stations
   * NWP
   * DEM
   */

  const sortedResults = [...results].sort(
    (a, b) =>
      b.quality.qualityScore -
      a.quality.qualityScore
  );

  const bestResult = sortedResults[0];

  const quality = calculateCombinedQuality(
    results as DataAdapterResult<unknown>[]
  );

  const sources = results
    .map((result) => result.source)
    .filter(
      (source): source is ObservationSource =>
        source !== "demo"
    );

  return {
    data: bestResult.data,

    sources,

    quality,

    timestamp:
      new Date().toISOString(),
  };
}


/* =========================================================
   QUALITY CHECK
   ========================================================= */

export function isDataUsable(
  quality: DataQuality
): boolean {

  return (
    quality.isValid &&
    quality.qualityScore >= 0.5
  );
}
