import type { WeatherData } from "../types/weather";

import {
  fetchIntelligence,
  type IntelligenceApiResponse,
} from "./api";


/*
 * ---------------------------------------------------------
 * HELPERS
 * ---------------------------------------------------------
 */

function getDominantHazard(
  response: IntelligenceApiResponse
): string {

  const hazards =
    response.cells.flatMap(
      (cell) => cell.hazards
    );

  if (
    hazards.length === 0
  ) {
    return "Stable Conditions";
  }

  const dominant =
    hazards.reduce(
      (highest, current) =>
        current.score >
        highest.score
          ? current
          : highest
    );

  return dominant.type;
}


function getAverage(
  values: number[]
): number {

  if (
    values.length === 0
  ) {
    return 0;
  }

  return (
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    ) /
    values.length
  );
}


/*
 * ---------------------------------------------------------
 * API → WEATHER DATA
 * ---------------------------------------------------------
 */

export function adaptIntelligenceToWeather(
  response: IntelligenceApiResponse
): WeatherData {

  const cells =
    response.cells;


  /*
   * -------------------------------------------------------
   * SPATIAL VALUES
   * -------------------------------------------------------
   */

  const rainfallValues =
    cells
      .map(
        (cell) =>
          cell.cell.rainfall
      )
      .filter(
        (
          value
        ): value is number =>
          value !== undefined
      );


  const temperatureValues =
    cells
      .map(
        (cell) =>
          cell.cell.temperature
      )
      .filter(
        (
          value
        ): value is number =>
          value !== undefined
      );


  const humidityValues =
    cells
      .map(
        (cell) =>
          cell.cell.humidity
      )
      .filter(
        (
          value
        ): value is number =>
          value !== undefined
      );


  const pressureValues =
    cells
      .map(
        (cell) =>
          cell.cell.pressure
      )
      .filter(
        (
          value
        ): value is number =>
          value !== undefined
      );


  const windSpeedValues =
    cells
      .map(
        (cell) =>
          cell.cell.wind_speed
      )
      .filter(
        (
          value
        ): value is number =>
          value !== undefined
      );


  const iwvValues =
    cells
      .map(
        (cell) =>
          cell.cell
            .integrated_water_vapour
      )
      .filter(
        (
          value
        ): value is number =>
          value !== undefined
      );


  const capeValues =
    cells
      .map(
        (cell) =>
          cell.cell.cape
      )
      .filter(
        (
          value
        ): value is number =>
          value !== undefined
      );


  const cinValues =
    cells
      .map(
        (cell) =>
          cell.cell.cin
      )
      .filter(
        (
          value
        ): value is number =>
          value !== undefined
      );


  const convergenceValues =
    cells
      .map(
        (cell) =>
          cell.cell
            .wind_convergence
      )
      .filter(
        (
          value
        ): value is number =>
          value !== undefined
      );


  /*
   * -------------------------------------------------------
   * SUMMARY
   * -------------------------------------------------------
   */

  const summary =
    response.summary;


  const dominantHazard =
    getDominantHazard(
      response
    );


  /*
   * -------------------------------------------------------
   * CONDITION
   * -------------------------------------------------------
   */

  let condition =
    "Stable Conditions";


  if (
    summary.highest_risk_level ===
    "Critical"
  ) {

    condition =
      dominantHazard;

  } else if (
    summary.highest_risk_level ===
    "High"
  ) {

    condition =
      dominantHazard;

  } else if (
    rainfallValues.length > 0 &&
    getAverage(
      rainfallValues
    ) >= 5
  ) {

    condition =
      "Rain";

  } else {

    condition =
      "Monitoring";
  }


  /*
   * -------------------------------------------------------
   * CURRENT VALUES
   * -------------------------------------------------------
   */

  const averageRainfall =
    getAverage(
      rainfallValues
    );

  const averagePressure =
    getAverage(
      pressureValues
    );


  /*
   * -------------------------------------------------------
   * WEATHER DATA
   * -------------------------------------------------------
   */

  return {

    location:
      response.location,

    current: {

      temperature:
        Number(
          getAverage(
            temperatureValues
          ).toFixed(1)
        ),

      condition,

      humidity:
        Number(
          getAverage(
            humidityValues
          ).toFixed(1)
        ),

      rainfall:
        Number(
          averageRainfall.toFixed(1)
        ),

      windSpeed:
        Number(
          getAverage(
            windSpeedValues
          ).toFixed(1)
        ),

      pressure:
        Number(
          averagePressure.toFixed(1)
        ),
    },


    /*
     * -----------------------------------------------------
     * ATMOSPHERIC INTELLIGENCE
     * -----------------------------------------------------
     */

    atmospheric: {

      integratedWaterVapour:
        Number(
          getAverage(
            iwvValues
          ).toFixed(2)
        ),

      cape:
        Number(
          getAverage(
            capeValues
          ).toFixed(0)
        ),

      cin:
        Number(
          getAverage(
            cinValues
          ).toFixed(0)
        ),

      windConvergence:
        Number(
          getAverage(
            convergenceValues
          ).toFixed(2)
        ),

      floodRisk:
        summary.maximum_risk_score,
    },


    /*
     * -----------------------------------------------------
     * RAINFALL HISTORY
     * -----------------------------------------------------
     *
     * The current intelligence API provides
     * spatial rainfall, not a historical time series.
     *
     * Therefore we expose the current spatial
     * average as one data point rather than
     * inventing historical observations.
     */

    rainfallHistory: [

      {
        time:
          new Date(
            response.generated_at
          ).toLocaleTimeString(
            [],
            {
              hour:
                "2-digit",

              minute:
                "2-digit",
            }
          ),

        rainfall:
          Number(
            averageRainfall.toFixed(1)
          ),
      },
    ],


    /*
     * -----------------------------------------------------
     * FLOOD RISK
     * -----------------------------------------------------
     */

    floodRisk: {

      score:
        summary.maximum_risk_score,

      level:
        summary.highest_risk_level === "Critical"
          ? "Critical"
          : summary.highest_risk_level === "High"
          ? "High"
          : summary.highest_risk_level === "Moderate"
          ? "Moderate"
          : "Low",

      description:
        summary.highest_risk_level ===
        "Critical"

          ? "Critical atmospheric and flood-risk conditions detected across the monitoring grid."

          : summary.highest_risk_level ===
            "High"

          ? "Elevated atmospheric and flood-risk conditions detected across the monitoring grid."

          : summary.highest_risk_level ===
            "Moderate"

          ? "Moderate atmospheric risk detected. Continued monitoring is recommended."

          : "Current atmospheric indicators remain within lower-risk ranges.",
    },


    lastUpdated:
      response.generated_at,
  };
}


/*
 * ---------------------------------------------------------
 * FETCH BACKEND WEATHER
 * ---------------------------------------------------------
 */

export async function
getBackendWeatherData(
  location =
    "Chennai Monitoring Zone"
): Promise<WeatherData> {

  const response =
    await fetchIntelligence(
      location
    );

  return adaptIntelligenceToWeather(
    response
  );
}
