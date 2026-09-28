import {
  fetchOpenMeteoWeather,
} from "./api";

import type {
  WeatherGrid,
  WeatherObservation,
} from "./gridTypes";

import {
  createWeatherGrid,
} from "./gridService";

import {
  createFusedObservation,
  fuseObservations,
} from "./observationFusionService";

/**
 * RainGuard SIH prototype monitoring area.
 *
 * The final SIH proposal specifies a 30 × 30
 * Chennai prototype grid.
 *
 * These bounds define the spatial framework.
 */
const liveGridConfig = {
  minLatitude: 12.90,
  maxLatitude: 13.20,

  minLongitude: 80.05,
  maxLongitude: 80.35,

  rows: 30,
  columns: 30,
};

/**
 * Generate spatial sample points across the
 * 30 × 30 monitoring grid.
 */
function createSamplePoints(
  rows: number,
  columns: number
): Array<{
  latitude: number;
  longitude: number;
}> {
  const points: Array<{
    latitude: number;
    longitude: number;
  }> = [];

  for (let row = 0; row < rows; row++) {
    const latitude =
      liveGridConfig.minLatitude +
      ((row + 0.5) / rows) *
        (liveGridConfig.maxLatitude -
          liveGridConfig.minLatitude);

    for (
      let column = 0;
      column < columns;
      column++
    ) {
      const longitude =
        liveGridConfig.minLongitude +
        ((column + 0.5) / columns) *
          (liveGridConfig.maxLongitude -
            liveGridConfig.minLongitude);

      points.push({
        latitude,
        longitude,
      });
    }
  }

  return points;
}

/**
 * Fetch live atmospheric observations
 * across the RainGuard monitoring grid.
 */
export async function fetchLiveGridObservations(): Promise<
  WeatherObservation[]
> {
  const points =
    createSamplePoints(
      liveGridConfig.rows,
      liveGridConfig.columns
    );

  const latitude =
    points
      .map((point) =>
        point.latitude.toFixed(4)
      )
      .join(",");

  const longitude =
    points
      .map((point) =>
        point.longitude.toFixed(4)
      )
      .join(",");

  const params =
    new URLSearchParams({
      latitude,

      longitude,

      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "precipitation",
        "pressure_msl",
        "wind_speed_10m",
        "wind_direction_10m",
        "cape",
        "convective_inhibition",
        "total_column_integrated_water_vapour",
      ].join(","),

      timezone: "auto",
    });

  const url =
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  const response =
    await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Open-Meteo grid request failed: ${response.status}`
    );
  }

  const data =
    await response.json();

  const responses =
    Array.isArray(data)
      ? data
      : [data];

  return responses.map(
    (item) => {
      const current =
        item.current ?? {};

      const observation:
        WeatherObservation = {
        latitude:
          item.latitude,

        longitude:
          item.longitude,

        temperature:
          current.temperature_2m,

        humidity:
          current.relative_humidity_2m,

        pressure:
          current.pressure_msl,

        rainfall:
          current.precipitation,

        windSpeed:
          current.wind_speed_10m,

        windDirection:
          current.wind_direction_10m,

        integratedWaterVapour:
          current
            .total_column_integrated_water_vapour,

        cape:
          current.cape,

        cin:
          current.convective_inhibition,
      };

      return observation;
    }
  );
}

/**
 * Build the live 30 × 30 weather grid.
 */
export async function createLiveWeatherGrid(): Promise<
  WeatherGrid
> {
  const observations =
    await fetchLiveGridObservations();

  const qualityAwareObservations =
    observations.map(
      (observation) =>
        createFusedObservation(
          observation,
          {
            source: "nwp",
            qualityScore: 1,
          }
        )
    );

  const fusedObservations =
    fuseObservations(
      qualityAwareObservations
    );

  return createWeatherGrid(
    fusedObservations,
    liveGridConfig
  );
}
