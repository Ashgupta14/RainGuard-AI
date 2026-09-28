import type { HyperLocalRisk } from "./hyperLocalRiskService";
import type { LeadWindowResult } from "./leadWindowService";
import {
  estimateTimeToFlood,
  type TimeToFloodResult,
} from "./timeToFloodService";

export type AlertSeverity =
  | "Advisory"
  | "Watch"
  | "Warning"
  | "Emergency";

export interface RainGuardAlert {
  id: string;

  cellId: string;

  hazard: string;

  severity: AlertSeverity;

  riskScore: number;

  headline: string;

  message: string;

  action: string;

  timeToImpact: TimeToFloodResult;

  leadWindow: LeadWindowResult;

  confidence: number;

  generatedAt: string;
}

/**
 * Convert risk level into an operational alert severity.
 */
function getAlertSeverity(
  risk: HyperLocalRisk
): AlertSeverity {
  switch (risk.level) {
    case "Critical":
      return "Emergency";

    case "High":
      return "Warning";

    case "Moderate":
      return "Watch";

    case "Low":
    default:
      return "Advisory";
  }
}

/**
 * Generate a concise public-safety action.
 */
function getRecommendedAction(
  severity: AlertSeverity,
  hazard: string
): string {
  switch (severity) {
    case "Emergency":
      return `Avoid exposed and low-lying areas. Follow official emergency instructions for ${hazard.toLowerCase()}.`;

    case "Warning":
      return `Prepare for possible ${hazard.toLowerCase()} impacts and avoid unnecessary travel through vulnerable areas.`;

    case "Watch":
      return `Monitor conditions closely and be prepared to move to a safer location if risk increases.`;

    case "Advisory":
    default:
      return `Continue monitoring local weather and RainGuard risk updates.`;
  }
}

/**
 * Generate an actionable headline.
 */
function getHeadline(
  severity: AlertSeverity,
  hazard: string
): string {
  switch (severity) {
    case "Emergency":
      return `Emergency: ${hazard} Risk`;

    case "Warning":
      return `Warning: ${hazard} Risk`;

    case "Watch":
      return `Watch: ${hazard} Conditions`;

    case "Advisory":
    default:
      return `Advisory: ${hazard} Conditions`;
  }
}

/**
 * Create an actionable alert for a hyper-local
 * grid location.
 *
 * Alerts are generated from prototype intelligence
 * and should not be interpreted as official
 * government warnings.
 */
export function createRainGuardAlert(
  risk: HyperLocalRisk,
  rainfall?: number
): RainGuardAlert {
  const severity =
    getAlertSeverity(risk);

  const hazard =
    risk.dominantHazard;

  const timeToImpact =
    estimateTimeToFlood(
      risk,
      rainfall
    );

  const headline =
    getHeadline(
      severity,
      hazard
    );

  const factorSummary =
    risk.contributingFactors.length > 0
      ? ` Key drivers: ${risk.contributingFactors.join(", ")}.`
      : "";

  const message =
    `${hazard} indicators are elevated in grid cell ${risk.cellId}. ` +
    `Current risk score is ${risk.score}/100. ` +
    `${timeToImpact.windowLabel}.` +
    factorSummary;

  const action =
    getRecommendedAction(
      severity,
      hazard
    );

  return {
    id:
      `RG-${risk.cellId}-${Date.now()}`,

    cellId:
      risk.cellId,

    hazard,

    severity,

    riskScore:
      risk.score,

    headline,

    message,

    action,

    timeToImpact,

    leadWindow:
      risk.leadWindow,

    confidence:
      risk.confidence,

    generatedAt:
      new Date().toISOString(),
  };
}

/**
 * Generate alerts only for cells where
 * meaningful action may be required.
 */
export function generateActiveAlerts(
  risks: HyperLocalRisk[],
  rainfallByCell?: Map<
    string,
    number
  >
): RainGuardAlert[] {
  return risks
    .filter(
      (risk) =>
        risk.level === "High" ||
        risk.level === "Critical"
    )
    .map((risk) =>
      createRainGuardAlert(
        risk,
        rainfallByCell?.get(
          risk.cellId
        )
      )
    );
}
