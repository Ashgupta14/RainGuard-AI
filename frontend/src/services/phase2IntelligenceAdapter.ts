import { ApiGridCellIntelligence, ApiDataSourceStatus, ApiProviderStatus } from "./api";

export interface FrontendPhase2Intelligence {
  hasPhase2Data: boolean;
  groundImpactScore: number | null;
  groundImpactLevel: string;
  groundImpactConfidence: number;
  futureRiskScore: number | null;
  futureRiskLevel: string;
  timeToImpactWindow: string;
  decisionPriority: string;
  decisionSeverity: string;
  decisionHeadline: string;
  decisionExplanation: string;
  recommendedActions: string[];
}

export function adaptPhase2Intelligence(cell: ApiGridCellIntelligence): FrontendPhase2Intelligence {
  const hasPhase2Data = !!(cell.ground_impact || cell.future_risk || cell.decision);
  
  return {
    hasPhase2Data,
    groundImpactScore: cell.ground_impact?.score ?? null,
    groundImpactLevel: cell.ground_impact?.level ?? "Unknown",
    groundImpactConfidence: cell.ground_impact?.confidence ?? 0,
    
    futureRiskScore: cell.future_risk?.score ?? null,
    futureRiskLevel: cell.future_risk?.level ?? "Unknown",
    
    timeToImpactWindow: cell.time_to_impact?.window ?? "N/A",
    
    decisionPriority: cell.decision?.priority ?? "Unknown",
    decisionSeverity: cell.decision?.severity ?? "Unknown",
    decisionHeadline: cell.decision?.headline ?? "No headline available",
    decisionExplanation: cell.decision?.explanation ?? "No explanation available",
    recommendedActions: cell.decision?.recommended_actions ?? []
  };
}

export function getDataModeLabel(status: ApiDataSourceStatus): string {
  return status.mode.toUpperCase();
}

export function getProviderLabel(providerStatus: ApiProviderStatus): string {
  return providerStatus.name;
}

export function isSimulationMode(status: ApiDataSourceStatus): boolean {
  return status.is_simulated;
}

export function isFallbackMode(status: ApiDataSourceStatus): boolean {
  return status.fallback_used;
}

export function getSourceStatus(providerStatus: ApiProviderStatus): string {
  return providerStatus.status.charAt(0).toUpperCase() + providerStatus.status.slice(1);
}
