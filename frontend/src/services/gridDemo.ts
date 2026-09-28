import { createWeatherGrid } from "./gridService";

import { demoObservations } from "./demoObservations";

import {
  createFusedObservation,
  fuseObservations,
} from "./observationFusionService";

import type {
  WeatherObservation,
} from "./gridTypes";


/*
 * ---------------------------------------------------------
 * DEMO GRID CONFIGURATION
 * ---------------------------------------------------------
 *
 * 30 × 30 = 900 spatial cells.
 */

const demoGridConfig = {
  minLatitude: 21.20,
  maxLatitude: 21.27,

  minLongitude: 81.60,
  maxLongitude: 81.67,

  rows: 30,
  columns: 30,
};


/*
 * ---------------------------------------------------------
 * SPATIAL HELPERS
 * ---------------------------------------------------------
 */

/**
 * Calculate approximate distance between two
 * latitude/longitude points.
 */
function calculateDistance(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
): number {

  const latitudeDifference =
    latitude1 -
    latitude2;

  const longitudeDifference =
    longitude1 -
    longitude2;

  return Math.sqrt(
    latitudeDifference ** 2 +
      longitudeDifference ** 2
  );
}


/**
 * Find nearby demo observations and create
 * a spatially derived observation.
 */
function createSpatialObservation(
  latitude: number,
  longitude: number
): WeatherObservation {

  if (
    demoObservations.length === 0
  ) {

    return {
      latitude,
      longitude,
    };
  }


  /*
   * Sort observations by spatial distance.
   */

  const nearest =
    [...demoObservations]
      .sort(
        (a, b) =>
          calculateDistance(
            latitude,
            longitude,
            a.latitude,
            a.longitude
          ) -
          calculateDistance(
            latitude,
            longitude,
            b.latitude,
            b.longitude
          )
      )
      .slice(0, 4);


  /*
   * -------------------------------------------------------
   * INVERSE DISTANCE WEIGHTING
   * -------------------------------------------------------
   *
   * Nearby observations have greater influence.
   */

  let totalWeight = 0;

  const weightedValues = {
    temperature: 0,
    humidity: 0,
    pressure: 0,
    rainfall: 0,
    windSpeed: 0,
    windDirection: 0,
    integratedWaterVapour: 0,
    cape: 0,
    cin: 0,
  };

  const fieldWeights = {
    temperature: 0,
    humidity: 0,
    pressure: 0,
    rainfall: 0,
    windSpeed: 0,
    windDirection: 0,
    integratedWaterVapour: 0,
    cape: 0,
    cin: 0,
  };


  for (
    const observation of nearest
  ) {

    const distance =
      calculateDistance(
        latitude,
        longitude,
        observation.latitude,
        observation.longitude
      );

    /*
     * Prevent division by zero when the
     * cell exactly matches an observation.
     */

    const weight =
      distance === 0
        ? 1
        : 1 /
          distance;


    totalWeight +=
      weight;


    function addValue(
      field:
        keyof typeof weightedValues,
      value:
        number | undefined
    ) {

      if (
        value === undefined
      ) {
        return;
      }

      weightedValues[field] +=
        value * weight;

      fieldWeights[field] +=
        weight;
    }


    addValue(
      "temperature",
      observation.temperature
    );

    addValue(
      "humidity",
      observation.humidity
    );

    addValue(
      "pressure",
      observation.pressure
    );

    addValue(
      "rainfall",
      observation.rainfall
    );

    addValue(
      "windSpeed",
      observation.windSpeed
    );

    addValue(
      "windDirection",
      observation.windDirection
    );

    addValue(
      "integratedWaterVapour",
      observation.integratedWaterVapour
    );

    addValue(
      "cape",
      observation.cape
    );

    addValue(
      "cin",
      observation.cin
    );
  }


  function getWeightedValue(
    field:
      keyof typeof weightedValues
  ):
    number | undefined {

    if (
      fieldWeights[field] === 0
    ) {
      return undefined;
    }

    return (
      weightedValues[field] /
      fieldWeights[field]
    );
  }


  /*
   * Add a very small deterministic spatial
   * variation so the demonstration field
   * is not completely flat.
   *
   * This is derived demo data, not a real
   * weather observation.
   */

  const spatialFactor =
    Math.sin(
      latitude * 180
    ) *
    Math.cos(
      longitude * 180
    );


  const rainfall =
    getWeightedValue(
      "rainfall"
    );

  const integratedWaterVapour =
    getWeightedValue(
      "integratedWaterVapour"
    );

  const cape =
    getWeightedValue(
      "cape"
    );


  return {

    latitude,

    longitude,

    temperature:
      getWeightedValue(
        "temperature"
      ),

    humidity:
      getWeightedValue(
        "humidity"
      ),

    pressure:
      getWeightedValue(
        "pressure"
      ),

    rainfall:
      rainfall !== undefined
        ? Math.max(
            0,
            rainfall +
              spatialFactor * 2
          )
        : undefined,

    windSpeed:
      getWeightedValue(
        "windSpeed"
      ),

    windDirection:
      getWeightedValue(
        "windDirection"
      ),

    integratedWaterVapour:
      integratedWaterVapour !==
      undefined
        ? Math.max(
            0,
            integratedWaterVapour +
              spatialFactor * 1.5
          )
        : undefined,

    cape:
      cape !== undefined
        ? Math.max(
            0,
            cape +
              spatialFactor * 50
          )
        : undefined,

    cin:
      getWeightedValue(
        "cin"
      ),
  };
}


/*
 * ---------------------------------------------------------
 * CREATE DEMO GRID
 * ---------------------------------------------------------
 */

export function createDemoWeatherGrid() {

  const spatialObservations:
    WeatherObservation[] = [];


  /*
   * Generate one derived observation
   * for each of the 900 grid cells.
   */

  for (
    let row = 0;
    row <
      demoGridConfig.rows;
    row++
  ) {

    const latitude =
      demoGridConfig.minLatitude +
      (
        (row + 0.5) /
        demoGridConfig.rows
      ) *
      (
        demoGridConfig.maxLatitude -
        demoGridConfig.minLatitude
      );


    for (
      let column = 0;
      column <
        demoGridConfig.columns;
      column++
    ) {

      const longitude =
        demoGridConfig.minLongitude +
        (
          (column + 0.5) /
          demoGridConfig.columns
        ) *
        (
          demoGridConfig.maxLongitude -
          demoGridConfig.minLongitude
        );


      spatialObservations.push(
        createSpatialObservation(
          latitude,
          longitude
        )
      );
    }
  }


  /*
   * Mark these values explicitly as
   * demonstration-derived observations.
   */

  const qualityAwareObservations =
    spatialObservations.map(
      (
        observation
      ) =>
        createFusedObservation(
          observation,
          {
            source: "demo",
            qualityScore: 0.75,
          }
        )
    );


  /*
   * Run them through the same fusion
   * pipeline used by the real architecture.
   */

  const fusedObservations =
    fuseObservations(
      qualityAwareObservations
    );


  return createWeatherGrid(
    fusedObservations,
    demoGridConfig
  );
}