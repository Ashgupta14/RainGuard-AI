import {
  runRainGuardPipeline,
} from "./rainGuardPipelineService";

export interface IntelligenceDiagnostics {
  gridDimensions: string;

  totalCells: number;

  populatedCells: number;

  coveragePercent: number;

  reliableCells: number;

  reliableCoveragePercent: number;

  averageRiskScore: number;

  maximumRiskScore: number;

  highestRiskLevel: string;

  highRiskCells: number;

  criticalRiskCells: number;

  activeAlerts: number;

  status:
    | "Operational"
    | "Degraded"
    | "Unavailable";

  generatedAt: string;
}


/**
 * Run the RainGuard intelligence pipeline
 * and generate a diagnostic summary.
 */
export async function
getIntelligenceDiagnostics(
  location =
    "Central Monitoring Zone"
): Promise<IntelligenceDiagnostics> {

  try {

    const pipeline =
      await runRainGuardPipeline(
        location
      );

    const summary =
      pipeline.summary;


    /*
     * -----------------------------------------------------
     * DETERMINE SYSTEM STATUS
     * -----------------------------------------------------
     */

    let status:
      | "Operational"
      | "Degraded"
      | "Unavailable" =
      "Operational";


    /*
     * A pipeline with no cells is unavailable.
     */

    if (
      summary.totalCells === 0
    ) {

      status =
        "Unavailable";

    }

    /*
     * Low reliable coverage means the
     * intelligence layer is degraded.
     */

    else if (
      summary.reliableCoveragePercent <
      50
    ) {

      status =
        "Degraded";
    }


    return {

      gridDimensions:
        `${pipeline.grid.rows} × ${pipeline.grid.columns}`,

      totalCells:
        summary.totalCells,

      populatedCells:
        summary.populatedCells,

      coveragePercent:
        summary.coveragePercent,

      reliableCells:
        summary.reliableCells,

      reliableCoveragePercent:
        summary.reliableCoveragePercent,

      averageRiskScore:
        summary.averageRiskScore,

      maximumRiskScore:
        summary.maximumRiskScore,

      highestRiskLevel:
        summary.highestRiskLevel,

      highRiskCells:
        summary.highRiskCells,

      criticalRiskCells:
        summary.criticalRiskCells,

      activeAlerts:
        pipeline.alerts.length,

      status,

      generatedAt:
        pipeline.generatedAt,
    };

  } catch (
    error
  ) {

    /*
     * The diagnostic service should not crash
     * the UI if the intelligence pipeline fails.
     */

    console.error(
      "RainGuard intelligence diagnostics failed:",
      error
    );


    return {

      gridDimensions:
        "Unavailable",

      totalCells: 0,

      populatedCells: 0,

      coveragePercent: 0,

      reliableCells: 0,

      reliableCoveragePercent: 0,

      averageRiskScore: 0,

      maximumRiskScore: 0,

      highestRiskLevel:
        "Unavailable",

      highRiskCells: 0,

      criticalRiskCells: 0,

      activeAlerts: 0,

      status:
        "Unavailable",

      generatedAt:
        new Date().toISOString(),
    };
  }
}
