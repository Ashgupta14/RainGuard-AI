import type {
  AtmosphericProfile,
  AtmosphericLevel,
} from "./atmosphericTypes";

import type { GridCell } from "./gridTypes";

/*
 * Creates a spatially varying atmospheric
 * profile for each demo grid cell.
 *
 * This is DEMO intelligence only.
 * It does not represent real atmospheric
 * observations.
 */

export function createDemoGridAtmosphericProfile(
  cell: GridCell
): AtmosphericProfile {

  const latitudeFactor =
    (cell.centerLatitude - 12.90) /
    (13.20 - 12.90);

  const longitudeFactor =
    (cell.centerLongitude - 80.05) /
    (80.35 - 80.05);

  /*
   * Create a smooth spatial variation
   * instead of giving every grid cell
   * exactly the same atmospheric profile.
   */

  const spatialFactor =
    (
      latitudeFactor +
      longitudeFactor
    ) / 2;

  const moistureVariation =
    Math.sin(
      cell.centerLatitude * 45
    ) *
    2;

  const temperatureVariation =
    Math.cos(
      cell.centerLongitude * 40
    ) *
    1.5;

  const levels: AtmosphericLevel[] = [
    {
      pressure: 1000,
      temperature:
        30 +
        temperatureVariation -
        spatialFactor * 1.5,
      relativeHumidity:
        78 +
        spatialFactor * 8 +
        moistureVariation,
    },

    {
      pressure: 925,
      temperature:
        27 +
        temperatureVariation -
        spatialFactor * 1.2,
      relativeHumidity:
        72 +
        spatialFactor * 10 +
        moistureVariation,
    },

    {
      pressure: 850,
      temperature:
        24 +
        temperatureVariation -
        spatialFactor,
      relativeHumidity:
        68 +
        spatialFactor * 12 +
        moistureVariation,
    },

    {
      pressure: 700,
      temperature:
        17 +
        temperatureVariation * 0.7,
      relativeHumidity:
        60 +
        spatialFactor * 15,
    },

    {
      pressure: 500,
      temperature:
        5 +
        temperatureVariation * 0.5,
      relativeHumidity:
        48 +
        spatialFactor * 12,
    },

    {
      pressure: 300,
      temperature:
        -10 +
        temperatureVariation * 0.3,
      relativeHumidity:
        35 +
        spatialFactor * 10,
    },
  ];

  return {
    levels,
  };
}
