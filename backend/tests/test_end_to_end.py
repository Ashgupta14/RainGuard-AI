import requests
import sys

def test_end_to_end():
    try:
        resp = requests.get("http://localhost:8000/api/intelligence")
        assert resp.status_code == 200, "Intelligence API failed"
        data = resp.json()
        
        assert "cells" in data, "No cells in response"
        assert len(data["cells"]) == 900, f"Expected 900 cells, got {len(data['cells'])}"
        
        cell = data["cells"][0]
        for field in ["cell", "risk", "future_risk", "ground_impact", "time_to_impact", "decision", "nowcasting"]:
            assert field in cell, f"Missing field {field} in cell"
            
        op_resp = requests.get("http://localhost:8000/api/operations/summary")
        assert op_resp.status_code == 200, "Operational summary API failed"
        
        print("PASS")
        sys.exit(0)
    except Exception as e:
        print(f"FAIL: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_end_to_end()
