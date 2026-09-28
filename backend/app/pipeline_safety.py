from .intelligence_orchestrator import orchestrate_pipeline
from .pipeline_metrics import PipelineTimer
from typing import Tuple, Optional, Any

def safe_run_pipeline() -> Tuple[Optional[Any], list, Optional[dict]]:
    timer = PipelineTimer()
    try:
        timer.start_stage("Data Intake")
        result = orchestrate_pipeline()
        timer.end_stage("operational")
        return result, timer.get_metrics(), None
    except Exception as e:
        timer.end_stage("failed")
        error_status = {
            "status": "error",
            "error_code": "PIPELINE_FAILURE",
            "message": f"Internal pipeline failure: {str(e)}"
        }
        return None, timer.get_metrics(), error_status
