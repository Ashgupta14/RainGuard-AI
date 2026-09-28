from typing import List, Optional

from pydantic import BaseModel

from .impact_api_models import GroundImpactAPI
from .future_api_models import FutureRiskAPI, TimeToImpactAPI, DecisionAPI
from .data_provenance import DataProvenance
from .confidence_breakdown import ConfidenceBreakdown
from .fusion_provenance import FusionProvenance


class MLModelInfo(BaseModel):
    name: str
    version: str
    type: str
    trained: bool
    evaluation_status: str


# ---------------------------------------------------------
# GRID CELL
# ---------------------------------------------------------

class GridCell(BaseModel):
    id: str

    latitude: float

    longitude: float

    observation_count: int = 0

    # Surface observations
    temperature: Optional[float] = None

    humidity: Optional[float] = None

    pressure: Optional[float] = None

    rainfall: Optional[float] = None

    wind_speed: Optional[float] = None

    wind_direction: Optional[float] = None

    # Atmospheric intelligence
    integrated_water_vapour: Optional[float] = None

    cape: Optional[float] = None

    cin: Optional[float] = None

    wind_convergence: Optional[float] = None

    wind_shear: Optional[float] = None


# ---------------------------------------------------------
# HAZARD
# ---------------------------------------------------------

class HazardPrediction(BaseModel):
    type: str

    score: int

    level: str

    confidence: int

    reason: str


# ---------------------------------------------------------
# CELL RISK
# ---------------------------------------------------------

class CellRisk(BaseModel):
    score: int

    level: str

    contributing_factors: List[str]

    feature_completeness: float

    is_reliable: bool


class RainfallNowcastingAPI(BaseModel):
    intensity: str
    trend: str
    change: float
    confidence: int

class CloudEvolutionNowcastingAPI(BaseModel):
    status: str
    source: str
    confidence: int

class NowcastingAPI(BaseModel):
    rainfall: RainfallNowcastingAPI
    cloud_evolution: CloudEvolutionNowcastingAPI

# ---------------------------------------------------------
# CELL INTELLIGENCE
# ---------------------------------------------------------

class GridCellIntelligence(BaseModel):
    cell: GridCell

    risk: CellRisk

    hazards: List[HazardPrediction]

    overall_risk_score: int

    overall_level: str

    ground_impact: Optional[GroundImpactAPI] = None

    future_risk: Optional[FutureRiskAPI] = None

    time_to_impact: Optional[TimeToImpactAPI] = None

    decision: Optional[DecisionAPI] = None
    
    provenance: Optional[DataProvenance] = None
    
    confidence: Optional[int] = None
    
    confidence_breakdown: Optional[ConfidenceBreakdown] = None
    
    fusion_provenance: Optional[FusionProvenance] = None
    
    nowcasting: Optional[NowcastingAPI] = None
    
    model: Optional[MLModelInfo] = None


class NowcastingSummaryAPI(BaseModel):
    cells_worsening: int
    cells_stable: int
    cells_improving: int
    highest_future_risk: int
    urgent_cells: int

class OperationalSummary(BaseModel):
    active_incidents: int
    critical_cells: int
    high_risk_cells: int
    urgent_cells: int
    worsening_cells: int
    highest_risk_location: dict
    dominant_hazard: str
    most_urgent_time_to_impact: str

# ---------------------------------------------------------
# GRID SUMMARY
# ---------------------------------------------------------

class GridRiskSummary(BaseModel):
    average_risk_score: int

    maximum_risk_score: int

    highest_risk_level: str

    high_risk_cells: int

    critical_risk_cells: int

    populated_cells: int

    total_cells: int

    coverage_percent: float

    reliable_cells: int

    reliable_coverage_percent: float


# ---------------------------------------------------------
# TIME TO IMPACT
# ---------------------------------------------------------

class TimeToImpact(BaseModel):
    estimated_minutes: Optional[int] = None

    estimated_hours: Optional[float] = None

    window_label: str

    urgency: str

    is_estimate: bool


# ---------------------------------------------------------
# LEAD WINDOW
# ---------------------------------------------------------

class LeadWindow(BaseModel):
    minimum_hours: float

    maximum_hours: float

    midpoint_hours: float

    label: str

    urgency: str

    is_within_target_window: bool



# ---------------------------------------------------------
# ALERT
# ---------------------------------------------------------

class RainGuardAlert(BaseModel):
    id: str

    cell_id: str

    hazard: str

    severity: str

    risk_score: int

    headline: str

    message: str

    action: str

    time_to_impact: TimeToImpact

    lead_window: Optional[LeadWindow] = None

    confidence: int

    generated_at: str


class DataStatusResponse(BaseModel):
    mode: str
    provider: str
    status: str
    fallback_available: bool
    message: str
    generated_at: str


class PipelineStage(BaseModel):
    name: str
    status: str
    message: str


class PipelineObservability(BaseModel):
    overall_status: str
    stages: List[PipelineStage]
    generated_at: str


class DemoScenario(BaseModel):
    scenario: str
    status: str
    headline: str
    highest_risk_cell: str | None = None
    highest_risk_score: int | None = None
    dominant_hazard: str | None = None
    active_alerts: int = 0
    steps: List[dict]


class ReliabilitySummary(BaseModel):
    status: str
    score: int
    message: str


# ---------------------------------------------------------
# COMPLETE INTELLIGENCE RESPONSE
# ---------------------------------------------------------

class IntelligenceResponse(BaseModel):
    status: str

    location: str

    grid_rows: int

    grid_columns: int

    cells: List[GridCellIntelligence]

    summary: GridRiskSummary

    alerts: List[RainGuardAlert]

    data_status: DataStatusResponse

    pipeline: PipelineObservability

    demo_scenario: DemoScenario

    reliability: ReliabilitySummary

    nowcasting_summary: Optional[NowcastingSummaryAPI] = None

    generated_at: str
