import type {
  ApiAlert,
  ApiGridCellIntelligence,
} from "./api";

export function getDominantHazard(
  cell: ApiGridCellIntelligence
): string {
  if (!cell.hazards.length) {
    return "Severe Weather";
  }

  return cell.hazards.reduce(
    (highest, current) =>
      current.score > highest.score
        ? current
        : highest
  ).type;
}

export function getRiskConfidence(
  cell: ApiGridCellIntelligence
): number {
  return Math.round(
    cell.risk.feature_completeness * 100
  );
}

export function getAlertLeadWindow(
  alert: ApiAlert
): string {
  return (
    alert.lead_window?.label ??
    alert.time_to_impact.window_label
  );
}

export function getAlertSummary(
  alert: ApiAlert
): string {
  return alert.message;
}
