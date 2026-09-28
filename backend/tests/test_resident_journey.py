import requests
import sys

def test_resident_journey():
    try:
        # Valid location
        resp = requests.get("http://localhost:8000/api/risk/location?latitude=13.05&longitude=80.20")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        
        for field in ["location", "cell", "risk", "future_risk", "ground_impact", "time_to_impact", "decision", "recommended_actions", "confidence"]:
            assert field in data, f"Missing field {field} in resident risk response"
        
        # Invalid location (0, 0)
        resp_invalid = requests.get("http://localhost:8000/api/risk/location?latitude=0&longitude=0")
        assert resp_invalid.status_code == 400, f"Expected 400 for invalid location, got {resp_invalid.status_code}"
        
        print("PASS")
        sys.exit(0)
    except Exception as e:
        print(f"FAIL: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_resident_journey()
