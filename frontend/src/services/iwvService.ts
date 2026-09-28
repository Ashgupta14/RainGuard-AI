import type {
  AtmosphericProfile,
  IWVResult,
} from "./atmosphericTypes";


/*
 * ---------------------------------------------------------
 * CONSTANTS
 * ---------------------------------------------------------
 */

const EPSILON = 0.622;

const GRAVITY = 9.80665;

const GAS_CONSTANT_DRY_AIR = 287.05;

const GAS_CONSTANT_WATER_VAPOUR = 461.495;


/*
 * ---------------------------------------------------------
 * SATURATION VAPOUR PRESSURE
 * ---------------------------------------------------------
 *
 * Magnus approximation.
 *
 * Temperature is in °C.
 * Result is in hPa.
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

function vapourPressure(
  temperature: number,
  relativeHumidity: number
): number {

  const saturationPressure =
    saturationVapourPressure(temperature);

  return (
    saturationPressure *
    (relativeHumidity / 100)
  );
}


/*
 * ---------------------------------------------------------
 * MIXING RATIO
 * ---------------------------------------------------------
 *
 * p  = atmospheric pressure
 * e  = vapour pressure
 *
 * Both are in hPa.
 */

function mixingRatio(
  pressure: number,
  vapourPressureValue: number
): number {

  return (
    (EPSILON * vapourPressureValue) /
    (pressure - vapourPressureValue)
  );
}


/*
 * ---------------------------------------------------------
 * CALCULATE IWV
 * ---------------------------------------------------------
 *
 * Uses pressure-coordinate integration:
 *
 * IWV ≈ (1/g) ∫ q dp
 *
 * where q is specific humidity.
 *
 * Result is kg/m².
 */

export function calculateIWV(
  profile: AtmosphericProfile
): IWVResult {

  if (profile.levels.length < 2) {

    return {
      value: 0,
      unit: "kg/m²",
      method: "Pressure-coordinate integration",
      valid: false,
    };
  }


  /*
   * Sort atmospheric levels from high pressure
   * toward low pressure.
   */

  const levels = [...profile.levels].sort(
    (a, b) => b.pressure - a.pressure
  );


  let integratedWater = 0;


  for (let i = 0; i < levels.length - 1; i++) {

    const lower = levels[i];

    const upper = levels[i + 1];


    const lowerVapourPressure =
      vapourPressure(
        lower.temperature,
        lower.relativeHumidity
      );

    const upperVapourPressure =
      vapourPressure(
        upper.temperature,
        upper.relativeHumidity
      );


    const lowerMixingRatio =
      mixingRatio(
        lower.pressure,
        lowerVapourPressure
      );

    const upperMixingRatio =
      mixingRatio(
        upper.pressure,
        upperVapourPressure
      );


    /*
     * Approximate specific humidity:
     *
     * q = r / (1 + r)
     */

    const lowerSpecificHumidity =
      lowerMixingRatio /
      (1 + lowerMixingRatio);

    const upperSpecificHumidity =
      upperMixingRatio /
      (1 + upperMixingRatio);


    /*
     * Trapezoidal integration in pressure coordinates.
     */

    const pressureDifference =
      (lower.pressure - upper.pressure) *
      100;


    const meanSpecificHumidity =
      (
        lowerSpecificHumidity +
        upperSpecificHumidity
      ) / 2;


    integratedWater +=
      meanSpecificHumidity *
      pressureDifference;
  }


  const iwv =
    integratedWater / GRAVITY;


  return {
    value: Math.max(0, iwv),
    unit: "kg/m²",
    method: "Pressure-coordinate integration",
    valid: true,
  };
}