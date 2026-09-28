from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from .intelligence_orchestrator import orchestrate_pipeline

from .data_source_intelligence import get_data_source_status
from .provider_status import get_provider_status

from .pipeline_observability import (
    get_pipeline_observability,
)

from .demo_scenario import build_demo_scenario

from .reliability import calculate_reliability_summary

from .grid_terrain import build_cell_terrain
from .grid_exposure import build_cell_exposure
from .grid_ground_impact import build_cell_ground_impact
from .unified_cell_intelligence import UnifiedCellIntelligence
from .intelligence_api_cell import adapt_unified_cell_to_api
from .multi_source_fusion import fuse_observations
from .models import NowcastingSummaryAPI
from .location_validation import validate_location
from .location_risk import find_cell_for_location
from .resident_risk import generate_resident_risk
from .resident_api_models import LocationRiskRequest, LocationRiskResponse
from .what_if_validation import validate_what_if_inputs
from .what_if_api_models import WhatIfRequest, WhatIfResponse
from .what_if import simulate_what_if_scenario
from .what_if_decision import compare_what_if_scenario
from .historical_store import historical_store
from .historical_baseline import calculate_historical_baseline
from .anomaly_detection import detect_anomaly
from .risk_fingerprint import generate_risk_fingerprint
from .historical_comparison import compare_historical
from .evaluation_api_models import FeedbackRequest, FeedbackResponse, EvaluationSummary, CalibrationSummary
from .feedback import Feedback
from .feedback_store import feedback_store
from .forecast_evaluation import evaluate_forecast
from .calibration import calculate_calibration_stats
from .self_calibration import generate_calibration_proposals
from .pipeline_safety import safe_run_pipeline
from .provider_adapter_registry import provider_registry
from .incident_store import incident_store
from .incident_api_models import IncidentResponse, IncidentListResponse, IncidentUpdateRequest
from .incident_correlation import correlate_alerts_to_incidents
from .operational_summary import generate_operational_summary
# ---------------------------------------------------------
# FASTAPI APPLICATION
# ---------------------------------------------------------

fastapi_app = FastAPI(
    title="RainGuard AI API",
    description=(
        "AI-driven hyper-local early warning "
        "and severe weather intelligence API."
    ),
    version="1.0.0",
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

import os

cors_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*",
]
env_origins = os.getenv("RAINGUARD_CORS_ORIGINS")
if env_origins:
    cors_origins.extend([o.strip() for o in env_origins.split(",")])

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# ROOT
# ---------------------------------------------------------

@fastapi_app.get("/")
def root():

    return {
        "name": "RainGuard AI",

        "status": "operational",

        "version": "1.0.0",
    }


# ---------------------------------------------------------
# HEALTH
# ---------------------------------------------------------

@fastapi_app.get("/health")
def health():

    return {
        "status": "healthy",

        "service":
            "RainGuard AI",
        "version": "prototype"
    }

@fastapi_app.get("/health/intelligence")
def intelligence_health():
    return {
        "Data pipeline": "operational",
        "Risk engine": "operational",
        "Alert engine": "operational",
        "Provider manager": "operational"
    }

@fastapi_app.get("/health/providers")
def provider_health():
    status = {}
    for entry in provider_registry.get_all_entries():
        status[entry.name] = entry.status.lower()
    return status


# ---------------------------------------------------------
# INTELLIGENCE
# ---------------------------------------------------------

def calculate_nowcasting_summary(cells) -> NowcastingSummaryAPI:
    worsening = 0
    stable = 0
    improving = 0
    highest_fr = 0
    urgent = 0
    
    for c in cells:
        if c.nowcasting:
            if c.nowcasting.rainfall.trend == "RISING":
                worsening += 1
            elif c.nowcasting.rainfall.trend == "FALLING":
                improving += 1
            else:
                stable += 1
                
        if c.future_risk:
            highest_fr = max(highest_fr, c.future_risk.score)
            
        if c.time_to_impact and "Urgent" in c.time_to_impact.window:
            urgent += 1
            
    return NowcastingSummaryAPI(
        cells_worsening=worsening,
        cells_stable=stable,
        cells_improving=improving,
        highest_future_risk=highest_fr,
        urgent_cells=urgent
    )

def extend_cells_with_phase2(cells, mode, provider):
    extended_cells = []
    for cell in cells:
        available_data = {
            "weather-model": {
                "temperature": cell.cell.temperature,
                "humidity": cell.cell.humidity,
                "pressure": cell.cell.pressure,
                "rainfall": cell.cell.rainfall,
                "wind_speed": cell.cell.wind_speed,
                "wind_direction": cell.cell.wind_direction,
                "cape": cell.cell.cape,
                "cin": cell.cell.cin
            }
        }
        fused = fuse_observations(cell.cell.latitude, cell.cell.longitude, available_data)
        
        terrain = build_cell_terrain(cell)
        exposure = build_cell_exposure(cell)
        impact = build_cell_ground_impact(cell, terrain, exposure)
        unified = UnifiedCellIntelligence(
            cell_id=cell.cell.id,
            latitude=cell.cell.latitude,
            longitude=cell.cell.longitude,
            atmospheric=cell,
            temporal=None,
            forecast=None,
            terrain=terrain,
            exposure=exposure,
            ground_impact=impact
        )
        extended_cells.append(adapt_unified_cell_to_api(unified, mode, provider, fused.provenance))
    return extended_cells


@fastapi_app.get("/api/intelligence")
def get_intelligence(
    location: str = "Chennai Monitoring Zone",
):
    try:
        pipeline_result, metrics, error_status = safe_run_pipeline()
        if error_status:
            return JSONResponse(status_code=503, content=error_status)

        pipeline_result.cells = extend_cells_with_phase2(
            pipeline_result.cells, 
            pipeline_result.mode, 
            pipeline_result.provider
        )
        correlate_alerts_to_incidents(pipeline_result.alerts)

        return {
            "status": "operational",
            "location": location,
            "grid_rows": pipeline_result.grid_rows,
            "grid_columns": pipeline_result.grid_columns,
            "cells": pipeline_result.cells,
            "summary": pipeline_result.summary,
            "alerts": pipeline_result.alerts,
            "data_status": get_data_source_status(
                mode=pipeline_result.mode,
                provider=pipeline_result.provider,
                fallback_used=pipeline_result.fallback_used,
                fallback_reason=pipeline_result.fallback_reason
            ),
            "provider_status": get_provider_status(
                mode=pipeline_result.mode,
                provider=pipeline_result.provider,
                valid_obs=pipeline_result.observations_valid,
                rejected_obs=pipeline_result.observations_rejected,
                last_fetch=pipeline_result.generated_at
            ),
            "pipeline": get_pipeline_observability(),
            "demo_scenario": build_demo_scenario({"cells": pipeline_result.cells, "alerts": pipeline_result.alerts}),
            "reliability": calculate_reliability_summary(pipeline_result.cells),
            "nowcasting_summary": calculate_nowcasting_summary(pipeline_result.cells),
            "generated_at": pipeline_result.generated_at,
        }
    except Exception as error:
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "error_code": "INTERNAL_ERROR",
                "message": f"RainGuard intelligence pipeline failed: {error}"
            }
        )


@fastapi_app.get("/api/risk/location", response_model=LocationRiskResponse)
def get_location_risk(latitude: float, longitude: float):
    validation = validate_location(latitude, longitude)
    if not validation.is_valid:
        raise HTTPException(status_code=400, detail=validation.message)
        
    try:
        pipeline_result = orchestrate_pipeline()
        cells = extend_cells_with_phase2(pipeline_result.cells, pipeline_result.mode, pipeline_result.provider)
        
        cell = find_cell_for_location(latitude, longitude, cells)
        if not cell:
            raise HTTPException(status_code=404, detail="No matching grid cell found for the given location.")
            
        summary = generate_resident_risk(cell)
        
        return LocationRiskResponse(
            latitude=latitude,
            longitude=longitude,
            cell_id=cell.cell.id,
            summary=summary,
            cell_details=cell
        )
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Location risk query failed: {error}")


@fastapi_app.post("/api/risk/what-if", response_model=WhatIfResponse)
def post_what_if_scenario(request: WhatIfRequest):
    validation = validate_location(request.latitude, request.longitude)
    if not validation.is_valid:
        raise HTTPException(status_code=400, detail=validation.message)
        
    try:
        pipeline_result = orchestrate_pipeline()
        cells = extend_cells_with_phase2(pipeline_result.cells, pipeline_result.mode, pipeline_result.provider)
        
        current_cell = find_cell_for_location(request.latitude, request.longitude, cells)
        if not current_cell:
            raise HTTPException(status_code=404, detail="No matching grid cell found for the given location.")
            
        scenario_val = validate_what_if_inputs(
            rainfall_change=request.rainfall_change,
            cape_change=request.cape_change,
            humidity_change=request.humidity_change,
            pressure_change=request.pressure_change,
            wind_change=request.wind_change,
            current_rainfall=current_cell.cell.rainfall or 0.0,
            current_humidity=current_cell.cell.humidity or 50.0,
            current_cape=current_cell.cell.cape or 0.0,
            current_wind=current_cell.cell.wind_speed or 0.0
        )
        if not scenario_val.is_valid:
            raise HTTPException(status_code=400, detail=scenario_val.message)
            
        simulated_cell = simulate_what_if_scenario(
            current_api_cell=current_cell,
            rainfall_change=request.rainfall_change,
            cape_change=request.cape_change,
            humidity_change=request.humidity_change,
            pressure_change=request.pressure_change,
            wind_change=request.wind_change
        )
        
        comparison = compare_what_if_scenario(current_cell, simulated_cell)
        
        return WhatIfResponse(
            current_state=current_cell,
            simulated_state=simulated_cell,
            comparison=comparison
        )
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"What-if scenario failed: {error}")

@fastapi_app.get("/api/risk/history")
def get_historical_history(latitude: float, longitude: float):
    validation = validate_location(latitude, longitude)
    if not validation.is_valid:
        raise HTTPException(status_code=400, detail=validation.message)
        
    try:
        pipeline_result = orchestrate_pipeline()
        cells = extend_cells_with_phase2(pipeline_result.cells, pipeline_result.mode, pipeline_result.provider)
        
        current_cell = find_cell_for_location(latitude, longitude, cells)
        if not current_cell:
            raise HTTPException(status_code=404, detail="No matching grid cell found for the given location.")
            
        observations = historical_store.get_observations_for_cell(latitude, longitude)
        baseline = calculate_historical_baseline(observations)
        
        anomaly = detect_anomaly(
            current_rainfall=current_cell.cell.rainfall or 0.0,
            current_risk=current_cell.overall_risk_score,
            baseline=baseline
        )
        
        comparison = compare_historical(current_cell, baseline, anomaly)
        
        return {
            "latitude": latitude,
            "longitude": longitude,
            "baseline": baseline.model_dump(),
            "anomaly": anomaly.model_dump(),
            "comparison": comparison.model_dump()
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Historical intelligence failed: {error}")

@fastapi_app.get("/api/risk/fingerprint")
def get_risk_fingerprint(latitude: float, longitude: float):
    validation = validate_location(latitude, longitude)
    if not validation.is_valid:
        raise HTTPException(status_code=400, detail=validation.message)
        
    try:
        pipeline_result = orchestrate_pipeline()
        cells = extend_cells_with_phase2(pipeline_result.cells, pipeline_result.mode, pipeline_result.provider)
        
        current_cell = find_cell_for_location(latitude, longitude, cells)
        if not current_cell:
            raise HTTPException(status_code=404, detail="No matching grid cell found for the given location.")
            
        observations = historical_store.get_observations_for_cell(latitude, longitude)
        fingerprint = generate_risk_fingerprint(current_cell, observations)
        
        return {
            "latitude": latitude,
            "longitude": longitude,
            "fingerprint": fingerprint.model_dump()
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Risk fingerprint failed: {error}")

@fastapi_app.post("/api/feedback", response_model=FeedbackResponse)
def post_feedback(request: FeedbackRequest):
    try:
        feedback = Feedback(
            alert_id=request.alert_id,
            cell_id=request.cell_id,
            observed_outcome=request.observed_outcome,
            actual_hazard=request.actual_hazard,
            actual_severity=request.actual_severity,
            user_feedback=request.user_feedback,
            source=request.source
        )
        feedback_store.add_feedback(feedback)
        return FeedbackResponse(feedback=feedback)
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Failed to submit feedback: {error}")

@fastapi_app.get("/api/evaluation", response_model=EvaluationSummary)
def get_evaluation():
    try:
        feedbacks = feedback_store.get_feedback()
        forecast_eval = evaluate_forecast(feedbacks)
        return EvaluationSummary(forecast_evaluation=forecast_eval)
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Failed to fetch evaluation: {error}")

@fastapi_app.get("/api/calibration", response_model=CalibrationSummary)
def get_calibration():
    try:
        feedbacks = feedback_store.get_feedback()
        stats = calculate_calibration_stats(feedbacks)
        suggestions = generate_calibration_proposals(feedbacks)
        return CalibrationSummary(calibration_stats=stats, suggestions=suggestions)
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Failed to fetch calibration: {error}")

@fastapi_app.get("/api/incidents", response_model=IncidentListResponse)
def get_incidents():
    return IncidentListResponse(incidents=incident_store.list_incidents())
    
@fastapi_app.get("/api/incidents/{incident_id}", response_model=IncidentResponse)
def get_incident(incident_id: str):
    incident = incident_store.get_incident(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return IncidentResponse(incident=incident)
    
@fastapi_app.patch("/api/incidents/{incident_id}", response_model=IncidentResponse)
def update_incident(incident_id: str, request: IncidentUpdateRequest):
    updates = {k: v for k, v in request.model_dump().items() if v is not None}
    incident = incident_store.update_incident(incident_id, updates)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return IncidentResponse(incident=incident)

@fastapi_app.get("/api/operations/summary")
def get_operations_summary():
    pipeline_result, _, error_status = safe_run_pipeline()
    if error_status:
        raise HTTPException(status_code=503, detail="Pipeline unavailable")
        
    cells = extend_cells_with_phase2(
        pipeline_result.cells, 
        pipeline_result.mode, 
        pipeline_result.provider
    )
    
    summary = generate_operational_summary(cells)
    return summary.model_dump()
