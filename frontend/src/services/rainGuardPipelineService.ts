import {
  getIntelligentWeatherGrid,
} from "./weatherService";

import {
  createHyperLocalRiskMap,
  type HyperLocalRisk,
} from "./hyperLocalRiskService";

import {
  generateActiveAlerts,
  type RainGuardAlert,
} from "./alertEngineService";

import {
  calculateGridRiskSummary,
  type GridRiskSummary,
} from "./gridRiskSummaryService";

export interface RainGuardPipelineResult {
  grid: Awaited<
    ReturnType<
      typeof getIntelligentWeatherGrid
    >
  >;

  risks: HyperLocalRisk[];

  summary: GridRiskSummary;

  alerts: RainGuardAlert[];

  generatedAt: string;
}

/**
 * Execute the complete RainGuard AI
 * prototype intelligence pipeline.
 *
 * Flow:
 *
 * Data
 * → Grid
 * → Atmospheric Features
 * → Risk
 * → Hyper-local Intelligence
 * → Time-to-impact
 * → Alerts
 */
export async function runRainGuardPipeline(
  location = "Central Monitoring Zone"
): Promise<RainGuardPipelineResult> {
  /*
   * 1. Generate intelligent spatial grid.
   */
  const grid =
    await getIntelligentWeatherGrid(
      location
    );

  /*
   * 2. Convert each grid cell into
   *    hyper-local risk intelligence.
   */
  const risks =
    createHyperLocalRiskMap(
      grid.cells
    );

  /*
   * 3. Generate overall monitored-area
   *    risk statistics.
   */
  const summary =
    calculateGridRiskSummary(
      grid
    );

  /*
   * 4. Build rainfall lookup from
   *    the actual grid-cell observations.
   */
  const rainfallByCell =
    new Map<string, number>();

  for (const cell of grid.cells) {
    if (
      cell.cell.rainfall !==
      undefined
    ) {
      rainfallByCell.set(
        cell.cell.id,
        cell.cell.rainfall
      );
    }
  }

  /*
   * 5. Generate actionable alerts.
   *
   * Each alert receives the rainfall
   * belonging to its own grid cell.
   */
  const alerts =
    generateActiveAlerts(
      risks,
      rainfallByCell
    );

  return {
    grid,

    risks,

    summary,

    alerts,

    generatedAt:
      new Date().toISOString(),
  };
}
