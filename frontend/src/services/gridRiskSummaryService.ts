import type { IntelligentWeatherGrid } from "./gridIntelligenceService";
import type { RiskLevel } from "./riskEngineService";

export interface GridRiskSummary {
  averageRiskScore: number;

  maximumRiskScore: number;

  highestRiskLevel: RiskLevel;

  highRiskCells: number;

  criticalRiskCells: number;

  populatedCells: number;

  totalCells: number;

  coveragePercent: number;

  reliableCells: number;

  reliableCoveragePercent: number;
}


/**
 * Calculate a summary of risk across the
 * complete spatial grid.
 */
export function calculateGridRiskSummary(
  grid: IntelligentWeatherGrid
): GridRiskSummary {

  const totalCells =
    grid.cells.length;


  /*
   * -------------------------------------------------------
   * EMPTY GRID
   * -------------------------------------------------------
   */

  if (
    totalCells === 0
  ) {

    return {
      averageRiskScore: 0,

      maximumRiskScore: 0,

      highestRiskLevel: "Low",

      highRiskCells: 0,

      criticalRiskCells: 0,

      populatedCells: 0,

      totalCells: 0,

      coveragePercent: 0,

      reliableCells: 0,

      reliableCoveragePercent: 0,
    };
  }


  /*
   * -------------------------------------------------------
   * OBSERVATION COVERAGE
   * -------------------------------------------------------
   *
   * observationCount > 0 means the cell contains
   * an actual observation after the spatial fusion stage.
   */

  const populatedCells =
    grid.cells.filter(
      (item) =>
        item.cell.observationCount >
        0
    ).length;


  const coveragePercent =
    (
      populatedCells /
      totalCells
    ) *
    100;


  /*
   * -------------------------------------------------------
   * RELIABLE INTELLIGENCE COVERAGE
   * -------------------------------------------------------
   *
   * A cell is considered reliable when the feature
   * vector has enough information for the risk engine.
   */

  const reliableCells =
    grid.cells.filter(
      (item) =>
        item.floodRisk.isReliable
    ).length;


  const reliableCoveragePercent =
    (
      reliableCells /
      totalCells
    ) *
    100;


  /*
   * -------------------------------------------------------
   * RISK SCORES
   * -------------------------------------------------------
   */

  const scores =
    grid.cells.map(
      (item) =>
        item.floodRisk.score
    );


  const averageRiskScore =
    scores.reduce(
      (
        sum,
        score
      ) =>
        sum + score,

      0
    ) /
    scores.length;


  const maximumRiskScore =
    Math.max(
      ...scores
    );


  /*
   * -------------------------------------------------------
   * HIGH / CRITICAL CELLS
   * -------------------------------------------------------
   */

  const highRiskCells =
    grid.cells.filter(
      (item) =>
        item.floodRisk.level ===
          "High" ||
        item.floodRisk.level ===
          "Critical"
    ).length;


  const criticalRiskCells =
    grid.cells.filter(
      (item) =>
        item.floodRisk.level ===
        "Critical"
    ).length;


  /*
   * -------------------------------------------------------
   * HIGHEST-RISK CELL
   * -------------------------------------------------------
   */

  const highestRiskCell =
    grid.cells.reduce(
      (
        highest,
        current
      ) => {

        if (
          current.floodRisk.score >
          highest.floodRisk.score
        ) {
          return current;
        }

        return highest;
      }
    );


  /*
   * -------------------------------------------------------
   * RETURN SUMMARY
   * -------------------------------------------------------
   */

  return {

    averageRiskScore:
      Math.round(
        averageRiskScore
      ),

    maximumRiskScore,

    highestRiskLevel:
      highestRiskCell
        .floodRisk
        .level,

    highRiskCells,

    criticalRiskCells,

    populatedCells,

    totalCells,

    coveragePercent:
      Number(
        coveragePercent.toFixed(1)
      ),

    reliableCells,

    reliableCoveragePercent:
      Number(
        reliableCoveragePercent.toFixed(1)
      ),
  };
}
