import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.models import GridCell
from app.intelligence import build_cell_intelligence
from app.main import extend_cells_with_phase2

def test_critical_scenario():
    try:
        cell = GridCell(
            id="test-critical",
            latitude=13.05,
            longitude=80.20,
            rainfall=60.0,
            cape=2000.0,
            pressure=990.0,
            wind_speed=25.0,
            humidity=95.0,
            observation_count=1
        )
        api_cell = build_cell_intelligence(cell)
        extended = extend_cells_with_phase2([api_cell], "test", "test")
        res = extended[0]
        
        assert res.overall_level in ["High", "Critical"], f"Expected High/Critical, got {res.overall_level}"
        assert res.future_risk.level in ["High", "Critical"], f"Expected High/Critical future risk, got {res.future_risk.level}"
        assert res.decision.priority in ["PREPARE", "URGENT ACTION", "URGENT", "RESPOND"], f"Expected RESPOND/URGENT/PREPARE priority, got {res.decision.priority}"
        
        print("PASS")
        sys.exit(0)
    except Exception as e:
        print(f"FAIL: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_critical_scenario()
