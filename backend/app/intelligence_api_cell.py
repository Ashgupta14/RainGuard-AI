from .models import GridCellIntelligence, DecisionAPI
from .models import NowcastingAPI, RainfallNowcastingAPI, CloudEvolutionNowcastingAPI
from .unified_cell_intelligence import UnifiedCellIntelligence
from .future_api_models import FutureRiskAPI, TimeToImpactAPI, DecisionAPI
from .impact_api_models import GroundImpactAPI
from .cell_decision import build_cell_decision
from .grid_temporal_history import get_previous_snapshot
from .atmospheric_history import create_snapshot
from .grid_temporal_intelligence import build_temporal_intelligence
from .forecast_features import build_forecast_features
from .baseline_forecast import BaselineForecastModel
from .risk_forecast_fusion import fuse_risk_signals
from .dynamic_time_to_impact import calculate_time_to_impact
from .risk_engine import get_risk_level
from .future_risk import build_future_risk
from .future_risk_decision import decide_future_risk
from .data_provenance import determine_provenance
from .confidence_breakdown import calculate_confidence_breakdown
from .fusion_provenance import FusionProvenance
from .rainfall_intelligence import build_rainfall_intelligence
from .cloud_evolution import build_cloud_evolution
from .risk_drivers import identify_risk_drivers
from .change_summary import generate_change_summary
from .impact_projection import project_impact
from .operator_decision_matrix import determine_operator_priority
from .alert_escalation import check_alert_escalation
from .action_recommendations import get_action_recommendations
from .decision_explanation import generate_decision_explanation
from .historical_store import historical_store
from .historical_baseline import calculate_historical_baseline
from .anomaly_detection import detect_anomaly
from .model_selector import select_model
from .models import MLModelInfo

def adapt_unified_cell_to_api(unified_cell: UnifiedCellIntelligence, mode: str = "demo", provider: str = "RainGuard Synthetic Weather Engine", fusion_provenance: FusionProvenance = None) -> GridCellIntelligence:
    grid_cell = unified_cell.atmospheric.cell
    cell_risk = unified_cell.atmospheric.risk
    hazards = unified_cell.atmospheric.hazards
    overall_score = unified_cell.atmospheric.overall_risk_score
    overall_level = unified_cell.atmospheric.overall_level
    
    ground_impact_api = GroundImpactAPI(
        score=unified_cell.ground_impact.ground_impact_score,
        level=unified_cell.ground_impact.level,
        confidence=unified_cell.ground_impact.confidence
    )
    
    cell_id = unified_cell.cell_id
    current_risk_score = unified_cell.ground_impact.ground_impact_score
    
    prev_snap = get_previous_snapshot(cell_id)
    if not prev_snap:
        prev_snap = create_snapshot(
            temperature=unified_cell.atmospheric.cell.temperature,
            humidity=unified_cell.atmospheric.cell.humidity,
            pressure=unified_cell.atmospheric.cell.pressure,
            rainfall=unified_cell.atmospheric.cell.rainfall,
            cape=unified_cell.atmospheric.cell.cape,
            cin=unified_cell.atmospheric.cell.cin,
            wind_speed=unified_cell.atmospheric.cell.wind_speed,
            wind_direction=unified_cell.atmospheric.cell.wind_direction
        )
        
    curr_snap = create_snapshot(
        temperature=unified_cell.atmospheric.cell.temperature,
        humidity=unified_cell.atmospheric.cell.humidity,
        pressure=unified_cell.atmospheric.cell.pressure,
        rainfall=unified_cell.atmospheric.cell.rainfall,
        cape=unified_cell.atmospheric.cell.cape,
        cin=unified_cell.atmospheric.cell.cin,
        wind_speed=unified_cell.atmospheric.cell.wind_speed,
        wind_direction=unified_cell.atmospheric.cell.wind_direction
    )
    
    temporal_intel = build_temporal_intelligence(curr_snap, prev_snap)
    forecast_features = build_forecast_features(curr_snap, temporal_intel.features)
    forecast_pred = BaselineForecastModel().predict(forecast_features)
    fused_risk = fuse_risk_signals(current_risk_score, forecast_pred, temporal_intel.risk)
    tti = calculate_time_to_impact(
        current_risk_score=current_risk_score,
        future_risk_score=forecast_pred.risk_score,
        rainfall_trend=temporal_intel.trend.rainfall_trend,
        atmospheric_trend="STABLE",
        severity=get_risk_level(current_risk_score)
    )
    
    observations = historical_store.get_observations_for_cell(grid_cell.latitude, grid_cell.longitude)
    baseline = calculate_historical_baseline(observations)
    anomaly = detect_anomaly(
        current_rainfall=grid_cell.rainfall or 0.0,
        current_risk=current_risk_score,
        baseline=baseline
    )
    
    future_risk = build_future_risk(
        current_risk_score=current_risk_score,
        forecast=forecast_pred,
        temporal_risk=temporal_intel.risk,
        fused_risk=fused_risk,
        rainfall_evolution=temporal_intel.trend.rainfall_trend,
        confidence=forecast_pred.confidence,
        historical_anomaly=anomaly.status
    )
    
    current_rainfall = grid_cell.rainfall or 0.0
    rainfall_intel = build_rainfall_intelligence(current_rainfall, 0.0)
    cloud_evol = build_cloud_evolution()

    risk_drivers = identify_risk_drivers(
        current_risk_score=current_risk_score,
        rainfall_trend=rainfall_intel.trend,
        rainfall_intensity=rainfall_intel.intensity_category,
        atmospheric_trend=temporal_intel.trend.instability_trend,
        ground_impact_score=current_risk_score
    )
    
    change_summary = generate_change_summary(temporal_intel.trend, rainfall_intel.trend)
    impact_projection = project_impact(future_risk.fused_risk.score, current_risk_score)
    
    operator_priority = determine_operator_priority(
        current_risk_score=current_risk_score,
        future_risk_score=future_risk.fused_risk.score,
        ground_impact_score=current_risk_score,
        is_urgent=tti.is_urgent
    )
    
    escalation = check_alert_escalation(
        future_risk_score=future_risk.fused_risk.score,
        current_risk_score=current_risk_score,
        time_to_impact=tti,
        ground_impact_score=current_risk_score
    )
    
    primary_hazard = hazards[0].type if hazards else "Severe weather"
    recommended_actions = get_action_recommendations(operator_priority, primary_hazard)
    
    explanation = generate_decision_explanation(
        rainfall_trend=rainfall_intel.trend,
        atmospheric_trend=temporal_intel.trend.instability_trend,
        ground_impact=ground_impact_api.level,
        future_risk_score=future_risk.fused_risk.score
    )
    
    future_risk_api = FutureRiskAPI(
        score=future_risk.fused_risk.score,
        level=future_risk.fused_risk.level
    )
    
    time_to_impact_api = TimeToImpactAPI(
        window=tti.window_description
    )
    
    decision_api = DecisionAPI(
        priority=operator_priority,
        severity=future_risk.fused_risk.level,
        risk_drivers=risk_drivers,
        change_summary=change_summary.model_dump(),
        impact_projection=impact_projection.model_dump(),
        escalation=escalation.model_dump(),
        recommended_actions=recommended_actions,
        historical_anomaly=anomaly.status,
        explanation=explanation
    )
    
    provenance = determine_provenance(provider, mode)
    confidence_breakdown = calculate_confidence_breakdown(mode)
    
    nowcasting = NowcastingAPI(
        rainfall=RainfallNowcastingAPI(
            intensity=rainfall_intel.intensity_category,
            trend=rainfall_intel.trend,
            change=rainfall_intel.change,
            confidence=rainfall_intel.confidence
        ),
        cloud_evolution=CloudEvolutionNowcastingAPI(
            status=cloud_evol.evolution,
            source=cloud_evol.source,
            confidence=cloud_evol.confidence
        )
    )
    
    return GridCellIntelligence(
        cell=grid_cell,
        risk=cell_risk,
        hazards=hazards,
        overall_risk_score=overall_score,
        overall_level=overall_level,
        ground_impact=ground_impact_api,
        future_risk=future_risk_api,
        time_to_impact=time_to_impact_api,
        decision=decision_api,
        provenance=provenance,
        confidence=future_risk.confidence,
        confidence_breakdown=confidence_breakdown,
        fusion_provenance=fusion_provenance,
        nowcasting=nowcasting,
        model=MLModelInfo(**select_model().model_dump())
    )
    
    return api_cell
