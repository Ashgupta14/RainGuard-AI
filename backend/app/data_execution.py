from typing import Any

from .live_pipeline import (
    fetch_live_grid,
)
from .pipeline import (
    run_demo_pipeline,
)
from .provider_manager import (
    get_active_data_mode,
)


def run_intelligence_pipeline() -> dict[
    str,
    Any,
]:
    mode = get_active_data_mode()

    if mode == "live":

        try:
            live_result = (
                fetch_live_grid()
            )

            if not live_result["cells"]:
                raise RuntimeError(
                    "Live provider returned "
                    "no usable grid cells."
                )

            return {
                "mode": "live",
                "fallback_used": False,
                **live_result,
            }

        except Exception as exc:

            demo_result = (
                run_demo_pipeline()
            )

            return {
                "mode": "fallback",
                "fallback_used": True,
                "fallback_reason": str(exc),
                **demo_result,
            }

    demo_result = (
        run_demo_pipeline()
    )

    return {
        "mode": "demo",
        "fallback_used": False,
        **demo_result,
    }
