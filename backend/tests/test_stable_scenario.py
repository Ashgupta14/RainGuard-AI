import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.models import GridCell
from app.intelligence import build_cell_intelligence
from app.main import extend_cells_with_phase2

def test_stable_scenario():
    try:
        cell = GridCell(
            id="test-stable",
            latitude=13.05,
            longitude=80.20,
            rainfall=0.0,
            cape=100.0,
            pressure=1013.0,
            wind_speed=5.0,
            humidity=50.0,
            observation_count=1
        )
        api_cell = build_cell_intelligence(cell)
        extended = extend_cells_with_phase2([api_cell], "test", "test")
        res = extended[0]
        
        assert res.overall_level in ["Low", "Moderate"], f"Expected Low/Moderate, got {res.overall_level}"
        assert res.future_risk.level in ["Low", "Moderate"], f"Expected Low/Moderate future risk, got {res.future_risk.level}"
        assert res.decision.priority in ["MONITOR", "WATCH"], f"Expected MONITOR/WATCH priority, got {res.decision.priority}"
        
        print("PASS")
        sys.exit(0)
    except Exception as e:
        print(f"FAIL: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_stable_scenario()
