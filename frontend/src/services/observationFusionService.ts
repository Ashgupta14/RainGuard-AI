import type {
  DataQuality,
  ObservationSource,
} from "./weatherTypes";

import type {
  WeatherObservation,
} from "./gridTypes";


export interface FusedObservation
  extends WeatherObservation {

  source:
    | ObservationSource
    | "demo";

  qualityScore: number;

  timestamp: string;
}


interface FusionOptions {

  source:
    | ObservationSource
    | "demo";

  qualityScore?: number;

  timestamp?: string;
}


/*
 * ---------------------------------------------------------
 * CREATE QUALITY-AWARE OBSERVATION
 * ---------------------------------------------------------
 */

export function createFusedObservation(
  observation: WeatherObservation,
  options: FusionOptions
): FusedObservation {

  return {

    ...observation,

    source:
      options.source,

    qualityScore:
      options.qualityScore ?? 1,

    timestamp:
      options.timestamp ??
      new Date().toISOString(),

  };

}


/*
 * ---------------------------------------------------------
 * OBSERVATION FUSION
 * ---------------------------------------------------------
 *
 * Observations close to one another spatially are grouped
 * together and combined using quality-weighted averages.
 *
 * Atmospheric variables are preserved during fusion:
 *
 * IWV
 * CAPE
 * CIN
 *
 * This is important because these variables are later used
 * by the RainGuard atmospheric intelligence engine.
 * ---------------------------------------------------------
 */

export function fuseObservations(
  observations: FusedObservation[]
): FusedObservation[] {

  if (
    observations.length === 0
  ) {
    return [];
  }


  /*
   * -------------------------------------------------------
   * GROUP NEARBY OBSERVATIONS
   * -------------------------------------------------------
   */

  const groups:
    FusedObservation[][] = [];


  for (
    const observation of observations
  ) {

    const existingGroup =
      groups.find(
        (group) => {

          const reference =
            group[0];


          const latitudeDifference =
            Math.abs(
              reference.latitude -
              observation.latitude
            );


          const longitudeDifference =
            Math.abs(
              reference.longitude -
              observation.longitude
            );


          return (
            latitudeDifference <=
              0.001 &&
            longitudeDifference <=
              0.001
          );

        }
      );


    if (
      existingGroup
    ) {

      existingGroup.push(
        observation
      );

    } else {

      groups.push([
        observation,
      ]);

    }

  }


  /*
   * -------------------------------------------------------
   * FUSE EACH GROUP
   * -------------------------------------------------------
   */

  return groups.map(
    (group) => {

      const totalWeight =
        group.reduce(
          (
            sum,
            item
          ) =>
            sum +
            item.qualityScore,
          0
        );


      /*
       * ---------------------------------------------------
       * WEIGHTED AVERAGE
       * ---------------------------------------------------
       */

      function weightedAverage(
        values:
          Array<
            number | undefined
          >
      ):
        number | undefined {

        let weightedSum =
          0;

        let weight =
          0;


        for (
          let index = 0;
          index <
          values.length;
          index++
        ) {

          const value =
            values[index];


          if (
            value ===
            undefined
          ) {
            continue;
          }


          const itemWeight =
            group[index]
              .qualityScore;


          weightedSum +=
            value *
            itemWeight;


          weight +=
            itemWeight;

        }


        if (
          weight === 0
        ) {
          return undefined;
        }


        return (
          weightedSum /
          weight
        );

      }


      /*
       * ---------------------------------------------------
       * BEST QUALITY SOURCE
       * ---------------------------------------------------
       */

      const bestSource =
        [...group].sort(
          (
            a,
            b
          ) =>
            b.qualityScore -
            a.qualityScore
        )[0];


      /*
       * ---------------------------------------------------
       * RETURN FUSED OBSERVATION
       * ---------------------------------------------------
       */

      return {

        /*
         * Spatial position
         */

        latitude:
          weightedAverage(
            group.map(
              (item) =>
                item.latitude
            )
          ) ??
          bestSource.latitude,


        longitude:
          weightedAverage(
            group.map(
              (item) =>
                item.longitude
            )
          ) ??
          bestSource.longitude,


        /*
         * Surface observations
         */

        temperature:
          weightedAverage(
            group.map(
              (item) =>
                item.temperature
            )
          ),


        humidity:
          weightedAverage(
            group.map(
              (item) =>
                item.humidity
            )
          ),


        pressure:
          weightedAverage(
            group.map(
              (item) =>
                item.pressure
            )
          ),


        rainfall:
          weightedAverage(
            group.map(
              (item) =>
                item.rainfall
            )
          ),


        windSpeed:
          weightedAverage(
            group.map(
              (item) =>
                item.windSpeed
            )
          ),


        /*
         * Wind direction is circular data.
         *
         * For this Phase 1 fusion layer we preserve the
         * highest-quality source instead of performing a
         * simple arithmetic average across directions.
         */

        windDirection:
          bestSource.windDirection,


        /*
         * -------------------------------------------------
         * ATMOSPHERIC INTELLIGENCE
         * -------------------------------------------------
         */

        integratedWaterVapour:
          weightedAverage(
            group.map(
              (item) =>
                item.integratedWaterVapour
            )
          ),


        cape:
          weightedAverage(
            group.map(
              (item) =>
                item.cape
            )
          ),


        cin:
          weightedAverage(
            group.map(
              (item) =>
                item.cin
            )
          ),


        /*
         * Source metadata
         */

        source:
          bestSource.source,


        qualityScore:
          Number(
            (
              totalWeight /
              group.length
            ).toFixed(2)
          ),


        timestamp:
          new Date().toISOString(),

      };

    }
  );

}


/*
 * ---------------------------------------------------------
 * OBSERVATION QUALITY
 * ---------------------------------------------------------
 */

export function createObservationQuality(
  observations:
    FusedObservation[]
): DataQuality {

  if (
    observations.length === 0
  ) {

    return {

      source:
        "demo",

      timestamp:
        new Date().toISOString(),

      qualityScore:
        0,

      isValid:
        false,

      missingFields:
        [],

    };

  }


  const averageQuality =
    observations.reduce(
      (
        sum,
        observation
      ) =>
        sum +
        observation.qualityScore,
      0
    ) /
    observations.length;


  const missingFields:
    string[] = [];


  /*
   * -------------------------------------------------------
   * REQUIRED / EXPECTED OBSERVATION FIELDS
   * -------------------------------------------------------
   */

  const optionalFields = [

    "temperature",

    "humidity",

    "pressure",

    "rainfall",

    "windSpeed",

    "windDirection",

    "integratedWaterVapour",

    "cape",

    "cin",

  ] as const;


  for (
    const field of optionalFields
  ) {

    const hasField =
      observations.some(
        (observation) =>
          observation[field] !==
          undefined
      );


    if (
      !hasField
    ) {

      missingFields.push(
        field
      );

    }

  }


  return {

    source:
      observations[0]
        .source,

    timestamp:
      new Date().toISOString(),

    qualityScore:
      Number(
        averageQuality.toFixed(2)
      ),

    isValid:
      averageQuality >=
      0.5,

    missingFields,

  };

}
