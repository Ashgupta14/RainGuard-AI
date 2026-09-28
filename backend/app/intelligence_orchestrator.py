from datetime import datetime, timezone
from .data_execution import run_intelligence_pipeline
from .live_pipeline_contract import LivePipelineResult
from .pipeline import calculate_grid_summary, generate_active_alerts

def orchestrate_pipeline() -> LivePipelineResult:
    result = run_intelligence_pipeline()
    
    mode = result.get("mode", "demo")
    fallback_used = result.get("fallback_used", False)
    provider = result.get("provider", "RainGuard Synthetic Weather Engine")
    
    mode_val = "fallback" if mode == "fallback" or fallback_used else mode
    
    cells = result.get("cells", [])
    
    summary = result.get("summary")
    if not summary:
        summary = calculate_grid_summary(cells)
        
    alerts = result.get("alerts")
    if alerts is None:
        alerts = generate_active_alerts(cells)

    return LivePipelineResult(
        mode=mode_val,
        provider=provider,
        observations_received=result.get("observations_received", 0),
        observations_valid=result.get("observations_valid", 0),
        observations_rejected=result.get("observations_rejected", 0),
        grid_rows=result.get("grid_rows", 30),
        grid_columns=result.get("grid_columns", 30),
        cells=cells,
        summary=summary,
        alerts=alerts,
        fallback_used=fallback_used,
        fallback_reason=result.get("fallback_reason"),
        generated_at=result.get("generated_at", datetime.now(timezone.utc).isoformat())
    )
