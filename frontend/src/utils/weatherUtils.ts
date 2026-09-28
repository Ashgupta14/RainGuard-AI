// ============================================================
// RainGuard AI - Weather Utilities
// ============================================================

import type {
  AtmosphericIndicators,
  FloodRisk,
} from "../types/weather";

/**
 * Convert a flood-risk score into a readable risk level.
 */
export function getFloodRiskLevel(score: number): FloodRisk["level"] {
  if (score >= 80) {
    return "Critical";
  }

  if (score >= 60) {
    return "High";
  }

  if (score >= 30) {
    return "Moderate";
  }

  return "Low";
}


/**
 * Generate a short explanation based on the flood-risk level.
 */
export function getFloodRiskDescription(
  level: FloodRisk["level"]
): string {
  switch (level) {
    case "Critical":
      return "Very high probability of localized flooding. Immediate attention is required.";

    case "High":
      return "Conditions indicate an elevated probability of localized flooding.";

    case "Moderate":
      return "Some atmospheric conditions may contribute to localized flooding.";

    case "Low":
      return "Current atmospheric conditions indicate a low flood risk.";

    default:
      return "Flood-risk assessment is currently unavailable.";
  }
}


/**
 * Determine whether atmospheric conditions are elevated.
 */
export function isAtmosphericRiskElevated(
  atmospheric: AtmosphericIndicators
): boolean {
  return (
    atmospheric.cape >= 1500 ||
    atmospheric.integratedWaterVapour >= 35 ||
    atmospheric.windConvergence >= 0.7
  );
}


/**
 * Format a numeric value to a fixed number of decimal places.
 */
export function formatValue(
  value: number,
  decimals = 1
): string {
  return value.toFixed(decimals);
}
