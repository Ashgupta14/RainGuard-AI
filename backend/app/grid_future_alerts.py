from typing import List
from .unified_cell_intelligence import UnifiedCellIntelligence
from .cell_decision import build_cell_decision
from .future_risk import build_future_risk
from .future_risk_decision import decide_future_risk
from .alert_escalation import check_alert_escalation
from .future_alert_content import generate_future_alert_content
from .future_alert import FutureAlert
from .grid_temporal_history import get_previous_snapshot
from .atmospheric_history import create_snapshot
from .grid_temporal_intelligence import build_temporal_intelligence
from .forecast_features import build_forecast_features
from .baseline_forecast import BaselineForecastModel
from .risk_forecast_fusion import fuse_risk_signals
from .dynamic_time_to_impact import calculate_time_to_impact
from .risk_engine import get_risk_level
from .alert_deduplication import deduplicate_alerts

def prioritize_alerts(alerts: List[FutureAlert]) -> List[FutureAlert]:
    def sort_key(alert: FutureAlert):
        severity_score = {"Critical": 4, "High": 3, "Moderate": 2, "Low": 1}.get(alert.severity, 0)
        urgency_score = 1 if alert.time_to_impact.is_urgent else 0
        hours = alert.time_to_impact.estimated_hours
        future = alert.future_risk
        return (-severity_score, -urgency_score, hours, -future, -alert.current_risk, -alert.confidence)
        
    return sorted(alerts, key=sort_key)

def process_grid_future_alerts(cells: List[UnifiedCellIntelligence]) -> List[FutureAlert]:
    alerts = []
    
    for unified_cell in cells:
        current_risk_score = unified_cell.ground_impact.ground_impact_score
        cell_id = unified_cell.cell_id
        
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
        
        future_risk = build_future_risk(
            current_risk_score=current_risk_score,
            forecast=forecast_pred,
            temporal_risk=temporal_intel.risk,
            fused_risk=fused_risk,
            rainfall_evolution=temporal_intel.trend.rainfall_trend,
            confidence=forecast_pred.confidence
        )
        
        current_decision = build_cell_decision(unified_cell)
        future_decision = decide_future_risk(current_decision, future_risk)
        escalation = check_alert_escalation(future_risk, future_decision)
        
        # Only issue alert if risk is elevated or escalated
        if future_decision.severity in ["High", "Critical"] or escalation.escalate:
            content = generate_future_alert_content(future_risk, future_decision, escalation)
            
            alerts.append(FutureAlert(
                cell_id=cell_id,
                severity=future_decision.severity,
                priority=future_decision.priority,
                current_risk=current_risk_score,
                future_risk=future_risk.fused_risk.score,
                trend=future_risk.trend,
                time_to_impact=future_risk.time_to_impact,
                confidence=future_risk.confidence,
                escalation=escalation.escalate,
                explanation=content.explanation,
                recommended_actions=content.recommended_actions
            ))
            
    alerts = deduplicate_alerts(alerts)
    return prioritize_alerts(alerts)
