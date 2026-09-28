import type { GridCellIntelligence } from "./gridIntelligenceService";
import {
  estimateLeadWindow,
  type LeadWindowResult,
} from "./leadWindowService";
import type { RiskLevel } from "./riskEngineService";

export interface HyperLocalRisk {
  cellId: string;
  latitude: number;
  longitude: number;
  score: number;
  level: RiskLevel;
  dominantHazard: string;
  contributingFactors: string[];
  confidence: number;
  isReliable: boolean;

  leadWindow: LeadWindowResult;
}

/**
 * Find the dominant hazard for a grid cell.
 */
function getDominantHazard(
  cell: GridCellIntelligence
): string {
  const hazards =
    cell.hazards.hazards;

  if (hazards.length === 0) {
    return "No significant hazard";
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

/**
 * Convert grid-cell intelligence into a
 * hyper-local risk record.
 */
export function createHyperLocalRisk(
  cell: GridCellIntelligence
): HyperLocalRisk {
  const risk =
    cell.floodRisk;

  const leadWindow =
    estimateLeadWindow(
      risk,
      cell.cell.rainfall
    );

  return {
    cellId:
      cell.cell.id,

    latitude:
      cell.cell.centerLatitude,

    longitude:
      cell.cell.centerLongitude,

    score:
      risk.score,

    level:
      risk.level,

    dominantHazard:
      getDominantHazard(cell),

    contributingFactors:
      risk.contributingFactors,

    confidence:
      Math.round(
        risk.featureCompleteness *
          100
      ),

    isReliable:
      risk.isReliable,

    leadWindow,
  };
}

/**
 * Generate hyper-local risk records
 * for the complete monitored grid.
 */
export function createHyperLocalRiskMap(
  cells: GridCellIntelligence[]
): HyperLocalRisk[] {
  return cells.map(
    createHyperLocalRisk
  );
}
