import type { HyperLocalRisk } from "./hyperLocalRiskService";

export interface TimeToFloodResult {
  estimatedMinutes: number | null;

  estimatedHours: number | null;

  windowLabel: string;

  urgency:
    | "Low"
    | "Moderate"
    | "High"
    | "Critical";

  isEstimate: boolean;
}

/**
 * Estimate the remaining lead window for potential
 * localized flooding.
 *
 * IMPORTANT:
 * This is a prototype heuristic.
 * It is NOT a trained predictive model.
 */
export function estimateTimeToFlood(
  risk: HyperLocalRisk,
  rainfall?: number
): TimeToFloodResult {
  if (
    risk.level === "Low" &&
    risk.score < 30
  ) {
    return {
      estimatedMinutes: null,

      estimatedHours: null,

      windowLabel:
        "No immediate flood threat",

      urgency: "Low",

      isEstimate: true,
    };
  }

  /*
   * Higher risk → shorter estimated lead window.
   */
  let estimatedMinutes: number;

  if (risk.score >= 80) {
    estimatedMinutes = 45;
  } else if (risk.score >= 60) {
    estimatedMinutes = 90;
  } else if (risk.score >= 30) {
    estimatedMinutes = 180;
  } else {
    estimatedMinutes = 360;
  }

  /*
   * Heavy rainfall can shorten the estimated window.
   */
  if (
    rainfall !== undefined &&
    rainfall >= 40
  ) {
    estimatedMinutes -= 15;
  }

  estimatedMinutes =
    Math.max(
      15,
      estimatedMinutes
    );

  const estimatedHours =
    Number(
      (
        estimatedMinutes / 60
      ).toFixed(1)
    );

  let windowLabel: string;

  if (estimatedMinutes < 60) {
    windowLabel =
      `Potential impact in ~${estimatedMinutes} min`;
  } else {
    windowLabel =
      `Potential impact in ~${estimatedHours} hr`;
  }

  return {
    estimatedMinutes,

    estimatedHours,

    windowLabel,

    urgency:
      risk.level,

    isEstimate: true,
  };
}
