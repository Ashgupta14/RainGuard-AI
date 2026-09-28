import type { WeatherData } from "../types/weather";

import {
  fetchOpenMeteoWeather,
} from "./api";

import type {
  DataAdapter,
  DataAdapterResult,
  WeatherQuery,
} from "./weatherTypes";

const demoWeatherData: WeatherData = {
  location: "Central Monitoring Zone",

  current: {
    temperature: 28,
    condition: "Heavy Rain",
    humidity: 82,
    rainfall: 24,
    windSpeed: 18,
    pressure: 1004,
  },

  atmospheric: {
    integratedWaterVapour: 62.66,
    cape: 0,
    cin: 1000,
    windConvergence: 16.192,
    floodRisk: 68,
  },

  rainfallHistory: [
    { time: "10:00", rainfall: 8 },
    { time: "10:30", rainfall: 11 },
    { time: "11:00", rainfall: 9 },
    { time: "11:30", rainfall: 15 },
    { time: "12:00", rainfall: 13 },
    { time: "12:30", rainfall: 19 },
    { time: "13:00", rainfall: 24 },
    { time: "13:30", rainfall: 20 },
    { time: "14:00", rainfall: 23 },
    { time: "14:30", rainfall: 26 },
  ],

  floodRisk: {
    score: 68,
    level: "High",
    description:
      "Conditions indicate an elevated probability of localized flooding.",
  },

  lastUpdated:
    new Date().toISOString(),
};

function createQuality(
  source: DataAdapterResult<unknown>["source"],
  missingFields: string[] = []
) {
  return {
    source,

    timestamp:
      new Date().toISOString(),

    qualityScore:
      missingFields.length === 0
        ? 1
        : 0.75,

    isValid:
      missingFields.length === 0,

    missingFields,
  };
}

/**
 * DEMO DATA ADAPTER
 *
 * Used when RainGuard is running in
 * demonstration mode.
 */
export const demoWeatherAdapter:
  DataAdapter<WeatherData> = {
  name:
    "RainGuard Demonstration Adapter",

  type: "demo",

  async getWeatherData(
    query: WeatherQuery
  ): Promise<
    DataAdapterResult<WeatherData>
  > {
    return {
      source: "demo",

      data: {
        ...demoWeatherData,

        location:
          query.location ||
          demoWeatherData.location,

        lastUpdated:
          new Date().toISOString(),
      },

      quality:
        createQuality("demo"),
    };
  },
};

/**
 * LIVE DATA ADAPTER
 *
 * Open-Meteo provides the current numerical
 * weather and atmospheric variables.
 *
 * No API key is required for this integration.
 */
export const liveWeatherAdapter:
  DataAdapter<WeatherData> = {
  name:
    "Open-Meteo Atmospheric Data Adapter",

  type: "nwp",

  async getWeatherData(
    query: WeatherQuery
  ): Promise<
    DataAdapterResult<WeatherData>
  > {
    /*
     * Use supplied coordinates when available.
     *
     * Otherwise use the centre of the
     * current prototype monitoring region.
     */
    const latitude =
      query.latitude ?? 21.235;

    const longitude =
      query.longitude ?? 81.635;

    const response =
      await fetchOpenMeteoWeather(
        latitude,
        longitude
      );

    const current =
      response.current;

    /*
     * Convert precipitation into a
     * simple human-readable condition.
     */
    let condition =
      "Stable Conditions";

    if (current.precipitation >= 20) {
      condition = "Heavy Rain";
    } else if (
      current.precipitation >= 5
    ) {
      condition = "Rain";
    } else if (
      current.cloud_cover >= 75
    ) {
      condition = "Cloudy";
    } else if (
      current.cloud_cover >= 40
    ) {
      condition = "Partly Cloudy";
    } else {
      condition = "Clear";
    }

    const weatherData: WeatherData = {
      location:
        query.location ||
        "Live Monitoring Zone",

      current: {
        temperature:
          current.temperature_2m,

        condition,

        humidity:
          current.relative_humidity_2m,

        rainfall:
          current.precipitation,

        windSpeed:
          current.wind_speed_10m,

        pressure:
          current.pressure_msl,
      },

      atmospheric: {
        integratedWaterVapour:
          current
            .total_column_integrated_water_vapour,

        cape:
          current.cape,

        cin:
          current.convective_inhibition,

        /*
         * Open-Meteo does not provide our
         * calculated horizontal convergence
         * directly through this request.
         *
         * This will be calculated later when
         * spatial wind observations are available.
         */
        windConvergence: 0,

        /*
         * Flood risk is calculated by our
         * RainGuard risk engine later.
         */
        floodRisk: 0,
      },

      rainfallHistory: [
        {
          time: current.time,
          rainfall:
            current.precipitation,
        },
      ],

      floodRisk: {
        score: 0,

        level: "Low",

        description:
          "Risk will be calculated by the RainGuard intelligence engine.",
      },

      lastUpdated:
        new Date().toISOString(),
    };

    return {
      source: "nwp",

      data: weatherData,

      quality:
        createQuality("nwp"),
    };
  },
};