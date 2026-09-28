/*
 * ---------------------------------------------------------
 * API BASE URL
 * ---------------------------------------------------------
 *
 * Uses VITE_API_BASE_URL when available.
 * Falls back to the local FastAPI server.
 */

const API_BASE_URL =
  (
    import.meta as ImportMeta & {
      env?: {
        VITE_API_BASE_URL?: string;
      };
    }
  ).env?.VITE_API_BASE_URL ??
  "http://127.0.0.1:8000";


/*
 * ---------------------------------------------------------
 * GENERIC API REQUEST
 * ---------------------------------------------------------
 */

async function apiRequest<T>(
  endpoint: string
): Promise<T> {

  const response =
    await fetch(
      `${API_BASE_URL}${endpoint}`
    );


  if (!response.ok) {

    throw new Error(
      `RainGuard API request failed: ${
        response.status
      }`
    );
  }


  return response.json();
}


/*
 * ---------------------------------------------------------
 * HEALTH
 * ---------------------------------------------------------
 */

export interface HealthResponse {
  status: string;
  service: string;
}


export async function fetchHealth():
  Promise<HealthResponse> {

  return apiRequest<HealthResponse>(
    "/health"
  );
}


/*
 * ---------------------------------------------------------
 * INTELLIGENCE — GRID CELL
 * ---------------------------------------------------------
 */

export interface ApiGridCell {

  id: string;

  latitude: number;

  longitude: number;

  observation_count: number;

  temperature?: number;

  humidity?: number;

  pressure?: number;

  rainfall?: number;

  wind_speed?: number;

  wind_direction?: number;

  integrated_water_vapour?: number;

  cape?: number;

  cin?: number;

  wind_convergence?: number;

  wind_shear?: number;
}


/*
 * ---------------------------------------------------------
 * HAZARD
 * ---------------------------------------------------------
 */

export interface ApiHazard {

  type: string;

  score: number;

  level: string;

  confidence: number;

  reason: string;
}


/*
 * ---------------------------------------------------------
 * CELL RISK
 * ---------------------------------------------------------
 */

export interface ApiCellRisk {

  score: number;

  level: string;

  contributing_factors: string[];

  feature_completeness: number;

  is_reliable: boolean;
}


/*
 * ---------------------------------------------------------
 * CELL INTELLIGENCE
 * ---------------------------------------------------------
 */

export interface ApiGridCellIntelligence {

  cell: ApiGridCell;

  risk: ApiCellRisk;

  hazards: ApiHazard[];

  overall_risk_score: number;

  overall_level: string;

  ground_impact?: ApiGroundImpact;

  future_risk?: ApiFutureRisk;

  time_to_impact?: ApiPhase2TimeToImpact;

  decision?: ApiDecision;
  
  model?: ApiMLModelInfo;
}

export interface ApiMLModelInfo {
  name: string;
  version: string;
  type: string;
  trained: boolean;
  evaluation_status: string;
}

export interface ApiGroundImpact {
  score: number;
  level: string;
  confidence: number;
}

export interface ApiFutureRisk {
  score: number;
  level: string;
}

export interface ApiPhase2TimeToImpact {
  window: string;
}

export interface ApiDecision {
  priority: string;
  severity: string;
  headline: string;
  explanation: string;
  recommended_actions: string[];
}


/*
 * ---------------------------------------------------------
 * GRID SUMMARY
 * ---------------------------------------------------------
 */

export interface ApiGridRiskSummary {

  average_risk_score: number;

  maximum_risk_score: number;

  highest_risk_level: string;

  high_risk_cells: number;

  critical_risk_cells: number;

  populated_cells: number;

  total_cells: number;

  coverage_percent: number;

  reliable_cells: number;

  reliable_coverage_percent: number;
}


/*
 * ---------------------------------------------------------
 * TIME TO IMPACT
 * ---------------------------------------------------------
 */

export interface ApiTimeToImpact {

  estimated_minutes:
    | number
    | null;

  estimated_hours:
    | number
    | null;

  window_label: string;

  urgency: string;

  is_estimate: boolean;
}


export interface ApiLeadWindow {
  minimum_hours: number;
  maximum_hours: number;
  midpoint_hours: number;
  label: string;
  urgency: string;
  is_within_target_window: boolean;
}


/*
 * ---------------------------------------------------------
 * ALERT
 * ---------------------------------------------------------
 */

export interface ApiAlert {

  id: string;

  cell_id: string;

  hazard: string;

  severity: string;

  risk_score: number;

  headline: string;

  message: string;

  action: string;

  time_to_impact:
    ApiTimeToImpact;

  lead_window?: ApiLeadWindow;

  confidence: number;

  generated_at: string;
}


export interface ApiDataSourceStatus {
  mode: string;
  provider: string;
  status: string;
  is_simulated: boolean;
  fallback_used: boolean;
  fallback_reason: string | null;
  source_type: string;
  generated_at: string;
}

export interface ApiProviderStatus {
  name: string;
  type: string;
  status: string;
  coverage: number;
  quality: number;
  observation_count: number;
  rejected_observations: number;
  last_successful_fetch: string | null;
}


/*
 * ---------------------------------------------------------
 * COMPLETE INTELLIGENCE RESPONSE
 * ---------------------------------------------------------
 */

export interface IntelligenceApiResponse {

  status: string;

  location: string;

  grid_rows: number;

  grid_columns: number;

  cells:
    ApiGridCellIntelligence[];

  summary:
    ApiGridRiskSummary;

  alerts:
    ApiAlert[];

  data_status: ApiDataSourceStatus;

  provider_status: ApiProviderStatus;

  generated_at: string;
}


/*
 * ---------------------------------------------------------
 * INTELLIGENCE API
 * ---------------------------------------------------------
 */

export async function fetchIntelligence(
  location =
    "Chennai Monitoring Zone"
): Promise<
  IntelligenceApiResponse
> {

  const encodedLocation =
    encodeURIComponent(
      location
    );
    
  const endpoint = `/api/intelligence?location=${encodedLocation}`;
  
  // Implement a 6-second timeout to prevent infinite hanging
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`RainGuard API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("Production API unavailable or timed out. Falling back to bundled demo data.", error);
    
    // Fallback to static bundled demo data
    try {
      const fallbackResponse = await fetch("/demo-intelligence.json");
      if (!fallbackResponse.ok) {
         throw new Error("Demo snapshot unavailable");
      }
      return await fallbackResponse.json();
    } catch (fallbackError) {
      console.error("Both live API and demo fallback failed", fallbackError);
      throw fallbackError;
    }
  }
}

// Stub for old frontend components
export async function fetchOpenMeteoWeather(lat: number, lon: number): Promise<any> {
  return null;
}

/*
 * ---------------------------------------------------------
 * EVALUATION & CALIBRATION
 * ---------------------------------------------------------
 */

export interface ApiEvaluationMetrics {
  status: string;
  precision: number;
  recall: number;
  f1: number;
  false_alarm_rate: number;
  miss_rate: number;
}

export interface ApiForecastEvaluation {
  evaluation_status: string;
  sample_count: number;
  metrics: ApiEvaluationMetrics;
  limitations: string[];
  disclaimer: string;
}

export interface ApiEvaluationSummary {
  forecast_evaluation: ApiForecastEvaluation;
}

export interface ApiCalibrationStats {
  total_predictions: number;
  confirmed_outcomes: number;
  correct_predictions: number;
  incorrect_predictions: number;
  accuracy: number;
  disclaimer: string;
}

export interface ApiCalibrationSuggestion {
  parameter: string;
  current_value: number;
  suggested_value: number;
  reason: string;
  action: string;
}

export interface ApiCalibrationSummary {
  calibration_stats: ApiCalibrationStats;
  suggestions: ApiCalibrationSuggestion[];
}

export async function fetchEvaluation(): Promise<ApiEvaluationSummary> {
  return apiRequest<ApiEvaluationSummary>("/api/evaluation");
}

export async function fetchCalibration(): Promise<ApiCalibrationSummary> {
  return apiRequest<ApiCalibrationSummary>("/api/calibration");
}

export interface ApiOperationalSummary {
  active_incidents: number;
  critical_cells: number;
  high_risk_cells: number;
  urgent_cells: number;
  worsening_cells: number;
  highest_risk_location: { latitude?: number; longitude?: number };
  dominant_hazard: string;
  most_urgent_time_to_impact: string;
}

export async function fetchOperationalSummary(): Promise<ApiOperationalSummary> {
  return apiRequest<ApiOperationalSummary>("/api/operations/summary");
}

export interface ApiIncident {
  incident_id: string;
  cell_id: string;
  hazard: string;
  severity: string;
  started_at: string;
  status: string;
  risk_score: number;
  decision?: string;
}

export async function fetchIncidents(): Promise<{ incidents: ApiIncident[] }> {
  return apiRequest<{ incidents: ApiIncident[] }>("/api/incidents");
}
