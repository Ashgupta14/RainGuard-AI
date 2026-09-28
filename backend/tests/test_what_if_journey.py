import requests
import sys

def test_what_if_journey():
    try:
        # Get baseline intelligence to get a cell ID
        intel_resp = requests.get("http://localhost:8000/api/intelligence")
        assert intel_resp.status_code == 200
        cells = intel_resp.json().get("cells", [])
        assert len(cells) > 0
        cell_id = cells[0]["cell"]["id"]
        
        # Valid what-if
        payload = {
            "cell_id": cell_id,
            "rainfall_change": 50.0
        }
        resp = requests.post("http://localhost:8000/api/risk/what-if", json=payload)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        
        for field in ["current_risk", "scenario_risk", "risk_delta", "level_change", "decision_change", "recommended_response"]:
            assert field in data, f"Missing field {field} in what-if response"
            
        # Invalid what-if
        invalid_payload = {
            "cell_id": cell_id,
            "rainfall_change": -100.0
        }
        resp_invalid = requests.post("http://localhost:8000/api/risk/what-if", json=invalid_payload)
        # Should be 400 or handled gracefully
        assert resp_invalid.status_code in [400, 422], f"Expected 400/422 for invalid what-if, got {resp_invalid.status_code}"
        
        print("PASS")
        sys.exit(0)
    except Exception as e:
        print(f"FAIL: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_what_if_journey()
