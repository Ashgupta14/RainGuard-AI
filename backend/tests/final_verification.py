import subprocess
import requests
import sys
import os
import time

def print_banner():
    print("========================================")
    print("        RAINGUARD FINAL CHECK           ")
    print("========================================")

def check(name, cmd=None, func=None):
    print(f"{name:<30}", end="")
    try:
        if cmd:
            subprocess.run(cmd, check=True, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if func:
            func()
        print("PASS")
        return True
    except Exception:
        print("FAIL")
        return False

def check_api_health():
    resp = requests.get("http://localhost:8000/api/intelligence")
    assert resp.status_code == 200

def check_test_script(script_name):
    cmd = f"python3 backend/tests/{script_name}"
    subprocess.run(cmd, check=True, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

def main():
    print_banner()
    
    passed = True
    
    passed &= check("Backend compilation", cmd="python3 -m compileall backend/app")
    passed &= check("Frontend TypeScript", cmd="cd frontend && npx tsc --noEmit")
    passed &= check("API health", func=check_api_health)
    passed &= check("Intelligence API", func=lambda: check_test_script("test_end_to_end.py"))
    passed &= check("Risk engine", func=lambda: check_test_script("test_critical_scenario.py"))
    passed &= check("Future risk", func=lambda: check_test_script("test_stable_scenario.py"))
    passed &= check("Resident risk", func=lambda: check_test_script("test_resident_journey.py"))
    passed &= check("What-if", func=lambda: check_test_script("test_what_if_journey.py"))
    
    # Check Demo Mode
    print(f"{'Demo Mode verification':<30}", end="")
    try:
        resp = requests.get("http://localhost:8000/api/intelligence")
        assert resp.json()["status"]["mode"] == "demo"
        print("PASS")
    except:
        print("FAIL")
        passed = False
        
    print(f"\nOVERALL: {'PASS' if passed else 'FAIL'}")
    print("========================================")

if __name__ == "__main__":
    main()
