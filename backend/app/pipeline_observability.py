from datetime import datetime, timezone

from .models import (
    PipelineObservability,
    PipelineStage,
)


def get_pipeline_observability() -> PipelineObservability:
    """
    Describes the operational state of the Phase 1
    RainGuard intelligence pipeline.

    The pipeline is currently backed by the demo/synthetic
    data adapter, so this reports processing capability
    rather than claiming live upstream observations.
    """

    stages = [
        PipelineStage(
            name="Data Intake",
            status="operational",
            message="Observation adapter is available.",
        ),
        PipelineStage(
            name="Data Fusion",
            status="operational",
            message="Multi-feature observation fusion is available.",
        ),
        PipelineStage(
            name="Spatial Grid",
            status="operational",
            message="30×30 hyper-local prototype grid is active.",
        ),
        PipelineStage(
            name="Atmospheric Features",
            status="operational",
            message="IWV, CAPE, CIN and kinematic features are processed.",
        ),
        PipelineStage(
            name="Risk Engine",
            status="operational",
            message="Cell-level flood risk scoring is active.",
        ),
        PipelineStage(
            name="Hazard Prediction",
            status="operational",
            message="Heavy rain, flash flood and severe weather hazards are evaluated.",
        ),
        PipelineStage(
            name="Alert Engine",
            status="operational",
            message="Actionable alerts and lead windows are generated.",
        ),
        PipelineStage(
            name="Intelligence API",
            status="operational",
            message="FastAPI intelligence endpoint is responding.",
        ),
    ]

    return PipelineObservability(
        overall_status="operational",
        stages=stages,
        generated_at=datetime.now(
            timezone.utc
        ).isoformat(),
    )
