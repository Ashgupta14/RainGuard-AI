import type { RiskLevel } from "./riskEngineService";

export interface LeadWindowRiskInput {
  score: number;
  level: RiskLevel;
}

export interface LeadWindowResult {
  minimumHours: number;
  maximumHours: number;
  midpointHours: number;
  label: string;
  urgency: RiskLevel;
  isWithinTargetWindow: boolean;
}

export function estimateLeadWindow(
  risk: LeadWindowRiskInput,
  rainfall?: number
): LeadWindowResult {

  /*
   * Low-risk conditions do not justify
   * an immediate warning window.
   */

  if (risk.level === "Low") {
    return {
      minimumHours: 6,
      maximumHours: 6,
      midpointHours: 6,
      label:
        "No immediate threat — monitoring window up to 6 hr",
      urgency: "Low",
      isWithinTargetWindow: true,
    };
  }

  let minimumHours = 2;
  let maximumHours = 6;

  if (risk.level === "Critical") {
    minimumHours = 2;
    maximumHours = 3;
  } else if (risk.level === "High") {
    minimumHours = 2;
    maximumHours = 4;
  } else if (risk.level === "Moderate") {
    minimumHours = 3;
    maximumHours = 6;
  }

  /*
   * Very heavy rainfall can shorten
   * the expected impact window.
   */

  if (
    rainfall !== undefined &&
    rainfall >= 40
  ) {
    minimumHours =
      Math.max(
        1,
        minimumHours - 1
      );
  }

  const midpointHours =
    Number(
      (
        (
          minimumHours +
          maximumHours
        ) / 2
      ).toFixed(1)
    );

  let label: string;

  if (
    minimumHours ===
    maximumHours
  ) {
    label =
      `Potential impact within ~${minimumHours} hr`;
  } else {
    label =
      `Potential impact within ${minimumHours}–${maximumHours} hr`;
  }

  return {
    minimumHours,
    maximumHours,
    midpointHours,
    label,
    urgency:
      risk.level,
    isWithinTargetWindow:
      minimumHours >= 2 &&
      maximumHours <= 6,
  };
}
