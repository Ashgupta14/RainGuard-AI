import type {
  AtmosphericProfile,
} from "./atmosphericTypes";

export interface CAPECINResult {
  cape: number;
  cin: number;
  unit: "J/kg";
  valid: boolean;
  method: string;
}


/*
 * ---------------------------------------------------------
 * CONSTANTS
 * ---------------------------------------------------------
 */

const RD = 287.05;
const RV = 461.495;
const CP = 1004;
const GRAVITY = 9.80665;
const EPSILON = RD / RV;


/*
 * ---------------------------------------------------------
 * SATURATION VAPOUR PRESSURE
 * ---------------------------------------------------------
 */

function saturationVapourPressure(
  temperature: number
): number {

  return (
    6.112 *
    Math.exp(
      (17.67 * temperature) /
      (temperature + 243.5)
    )
  );
}


/*
 * ---------------------------------------------------------
 * ACTUAL VAPOUR PRESSURE
 * ---------------------------------------------------------
 */

function actualVapourPressure(
  temperature: number,
  relativeHumidity: number
): number {

  return (
    saturationVapourPressure(temperature) *
    (relativeHumidity / 100)
  );
}


/*
 * ---------------------------------------------------------
 * MIXING RATIO
 * ---------------------------------------------------------
 */

function mixingRatio(
  pressure: number,
  vapourPressure: number
): number {

  return (
    EPSILON *
    vapourPressure /
    (pressure - vapourPressure)
  );
}


/*
 * ---------------------------------------------------------
 * DEW POINT
 * ---------------------------------------------------------
 */

function dewPoint(
  temperature: number,
  relativeHumidity: number
): number {

  const rh = Math.max(
    1,
    Math.min(100, relativeHumidity)
  );

  const gamma =
    Math.log(rh / 100) +
    (17.67 * temperature) /
    (temperature + 243.5);

  return (
    243.5 * gamma /
    (17.67 - gamma)
  );
}


/*
 * ---------------------------------------------------------
 * VIRTUAL TEMPERATURE
 * ---------------------------------------------------------
 */

function virtualTemperature(
  temperature: number,
  mixingRatioValue: number
): number {

  return (
    (temperature + 273.15) *
    (1 + 0.61 * mixingRatioValue)
  );
}


/*
 * ---------------------------------------------------------
 * CALCULATE CAPE / CIN
 * ---------------------------------------------------------
 *
 * This is a simplified pressure-profile implementation.
 *
 * It is intended as the first computational layer for
 * RainGuard. A production implementation will later use
 * parcel-lifting thermodynamics with more complete
 * atmospheric soundings.
 */

export function calculateCAPECIN(
  profile: AtmosphericProfile
): CAPECINResult {

  if (profile.levels.length < 2) {

    return {
      cape: 0,
      cin: 0,
      unit: "J/kg",
      valid: false,
      method: "Pressure-profile parcel approximation",
    };
  }


  const levels = [...profile.levels].sort(
    (a, b) => b.pressure - a.pressure
  );


  /*
   * Surface parcel.
   */

  const surface = levels[0];

  const surfaceDewPoint =
    dewPoint(
      surface.temperature,
      surface.relativeHumidity
    );

  const surfaceMixingRatio =
    mixingRatio(
      surface.pressure,
      actualVapourPressure(
        surface.temperature,
        surface.relativeHumidity
      )
    );


  const surfaceVirtualTemperature =
    virtualTemperature(
      surface.temperature,
      surfaceMixingRatio
    );


  let cape = 0;
  let cin = 0;


  /*
   * Approximate parcel temperature evolution.
   *
   * Below the lifting condensation level we use a
   * dry-adiabatic approximation.
   *
   * Above it we use a moist-adiabatic approximation.
   */

  const surfaceTemperatureK =
    surface.temperature + 273.15;


  const surfaceDewPointK =
    surfaceDewPoint + 273.15;


  const lclTemperature =
    surfaceDewPointK;


  for (let i = 0; i < levels.length - 1; i++) {

    const lower = levels[i];
    const upper = levels[i + 1];


    const lowerTemperatureK =
      lower.temperature + 273.15;

    const upperTemperatureK =
      upper.temperature + 273.15;


    /*
     * Pressure ratio.
     */

    const pressureRatio =
      upper.pressure / surface.pressure;


    /*
     * Dry adiabatic parcel temperature.
     */

    const dryParcelTemperature =
      surfaceTemperatureK *
      Math.pow(
        pressureRatio,
        RD / CP
      );


    /*
     * Moist adjustment above the approximate LCL.
     *
     * This is intentionally simplified for the initial
     * RainGuard calculation layer.
     */

    let parcelTemperatureK =
      dryParcelTemperature;


    if (dryParcelTemperature < lclTemperature) {

      parcelTemperatureK =
        dryParcelTemperature +
        0.0007 *
        (
          surfaceTemperatureK -
          dryParcelTemperature
        );
    }


    const environmentalVirtualTemperature =
      virtualTemperature(
        upper.temperature,
        mixingRatio(
          upper.pressure,
          actualVapourPressure(
            upper.temperature,
            upper.relativeHumidity
          )
        )
      );


    const parcelBuoyancy =
      GRAVITY *
      (
        parcelTemperatureK -
        environmentalVirtualTemperature
      ) /
      environmentalVirtualTemperature;


    /*
     * Approximate vertical thickness using the
     * hypsometric relation.
     */

    const meanTemperature =
      (
        lowerTemperatureK +
        upperTemperatureK
      ) / 2;


    const heightDifference =
      (
        RD *
        meanTemperature /
        GRAVITY
      ) *
      Math.log(
        lower.pressure /
        upper.pressure
      );


    const energy =
      parcelBuoyancy *
      Math.abs(heightDifference);


    if (energy > 0) {
      cape += energy;
    } else {
      cin += Math.abs(energy);
    }


    /*
     * Avoid unused-variable issues while keeping the
     * atmospheric calculation explicit.
     */

    void lowerTemperatureK;
  }


  /*
   * CAPE and CIN cannot be negative.
   */

  cape = Math.max(0, cape);
  cin = Math.max(0, cin);


  /*
   * Prevent unrealistically large values from a
   * simplified demo profile.
   */

  cape = Math.min(cape, 5000);
  cin = Math.min(cin, 1000);


  return {
    cape: Number(cape.toFixed(1)),
    cin: Number(cin.toFixed(1)),
    unit: "J/kg",
    valid: true,
    method: "Pressure-profile parcel approximation",
  };
}