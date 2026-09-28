import type { WeatherData } from "../types/weather";

import {
  demoWeatherAdapter,
  liveWeatherAdapter,
} from "./weatherAdapters";

import type {
  DataSource,
  WeatherQuery,
} from "./weatherTypes";

import { createDemoWeatherGrid } from "./gridDemo";
import { createLiveWeatherGrid } from "./liveGridService";

import type { WeatherGrid } from "./gridTypes";

import { calculateIWV } from "./iwvService";
import { demoAtmosphericProfile } from "./demoAtmosphericProfile";
import { calculateCAPECIN } from "./capeService";
import { calculateKinematics } from "./kinematicsService";
import { demoWindObservations } from "./demoWindObservations";

import {
  buildGridIntelligence,
  type IntelligentWeatherGrid,
} from "./gridIntelligenceService";

let activeDataSource: DataSource = "demo";

export function setDataSource(
  source: DataSource
): void {
  activeDataSource = source;
}

export function getDataSource(): DataSource {
  return activeDataSource;
}

function getActiveAdapter() {
  if (activeDataSource === "live") {
    return liveWeatherAdapter;
  }

  return demoWeatherAdapter;
}

export async function getWeatherData(
  location = "Central Monitoring Zone"
): Promise<WeatherData> {
  const query: WeatherQuery = {
    location,
  };

  const adapter =
    getActiveAdapter();

  const adapterResult =
    await adapter.getWeatherData(
      query
    );

  const weatherData =
    adapterResult.data;

  /*
   * Demo mode:
   *
   * Use our scientific demonstration
   * atmospheric profile.
   */
  if (activeDataSource === "demo") {
    const iwvResult =
      calculateIWV(
        demoAtmosphericProfile
      );

    const capeCinResult =
      calculateCAPECIN(
        demoAtmosphericProfile
      );

    const kinematicsResult =
      calculateKinematics(
        demoWindObservations,
        demoWindObservations[0],
        {
          ...demoWindObservations[0],
          speed: 30,
          direction: 250,
        }
      );

    return {
      ...weatherData,

      atmospheric: {
        ...weatherData.atmospheric,

        integratedWaterVapour:
          Number(
            iwvResult.value.toFixed(2)
          ),

        cape:
          capeCinResult.cape,

        cin:
          capeCinResult.cin,

        windConvergence:
          kinematicsResult.convergence,
      },

      lastUpdated:
        new Date().toISOString(),
    };
  }

  /*
   * Live mode:
   *
   * The adapter already contains the
   * real Open-Meteo atmospheric values.
   *
   * Do not overwrite them with demo values.
   */
  return {
    ...weatherData,

    lastUpdated:
      new Date().toISOString(),
  };
}

/**
 * Get the base spatial weather grid.
 */
export async function getWeatherGrid(
  location = "Central Monitoring Zone"
): Promise<WeatherGrid> {
  if (activeDataSource === "live") {
    return createLiveWeatherGrid();
  }

  return createDemoWeatherGrid();
}

/**
 * Get the complete atmospheric intelligence grid.
 */
export async function getIntelligentWeatherGrid(
  location = "Central Monitoring Zone"
): Promise<IntelligentWeatherGrid> {
  const weatherGrid =
    await getWeatherGrid(
      location
    );

  /*
   * In live mode, atmospheric variables
   * already exist on the observations/grid.
   *
   * The current intelligence pipeline will
   * consume those values where available.
   */
  return buildGridIntelligence(
    weatherGrid
  );
}