# RainGuard AI

**AI-Driven Hyper-Local Early Warning System for Severe Weather Nowcasting** 


## 1. Project Overview
RainGuard AI is a sophisticated intelligence engine designed to convert complex atmospheric signals into hyper-local, time-bound flood risk intelligence. By fusing multiple meteorological sources with ground impact data, the system provides actionable, high-confidence early warnings for highly vulnerable urban areas.

## 2. Problem Statement
Urban areas like Chennai face increasing vulnerability to flash floods driven by short-duration, high-intensity convective rainfall. Existing weather forecasting models often lack the hyper-local resolution and rapid update cycles required to trigger life-saving preemptive action. There is a critical need for a system that translates raw meteorological parameters into actionable infrastructure-level impact intelligence.

## 3. Our Solution
RainGuard AI bridges the gap between atmospheric science and municipal disaster response. It operates on a high-resolution spatial grid, constantly processing key thermodynamic and kinematic indicators (such as CAPE, CIN, and Wind Convergence) to generate early warnings—targeting a critical 2–6 hour lead window.

## 4. Key Capabilities
- **Real-Time Atmospheric Monitoring:** Ingests live weather parameters across a high-resolution grid.
- **Flood Risk Intelligence:** Translates rainfall and convective threat into explicit flood potential scores.
- **Dynamic Alerts:** Dispatches severity-based warnings tied directly to specific grid locations.
- **Explainable Decisions:** Provides human-readable rationales for AI-driven risk assessments to assist emergency operators.

## 5. System Architecture
```text
Data Sources (Live/Simulated)
      ↓
Data Intake
      ↓
Data Fusion + Quality Control
      ↓
Spatial / Temporal Gridding
      ↓
Atmospheric Feature Engine
      ↓
AI / Risk Engine
      ↓
Hazard Prediction
      ↓
Impact Engine
      ↓
Hyper-Local Grid Risk
      ↓
Actionable Alerts
      ↓
React GIS Dashboard
```

## 6. Atmospheric Intelligence
RainGuard evaluates complex thermodynamic variables beyond simple rainfall:
- **CAPE (Convective Available Potential Energy):** Measures atmospheric instability.
- **CIN (Convective Inhibition):** Assesses the "cap" preventing storm formation.
- **IWV (Integrated Water Vapour):** Tracks total column moisture available for precipitation.
- **Kinematics:** Wind convergence and shear to detect storm organization.

## 7. Risk Assessment
The system utilizes a fused risk score that combines meteorological threat levels with static vulnerability indicators (such as terrain elevation and historical flood propensity), ensuring alerts are context-aware.

## 8. Hyper-Local Grid
The current prototype is deployed over a **30 × 30 spatial grid (900 distinct cells)** covering the Chennai Metropolitan Area. This micro-scale resolution ensures warnings are specific to neighborhoods (e.g., Velachery vs. Anna Nagar) rather than entire districts.

## 9. Alert & Decision Engine
A dynamic rules engine evaluates hazard scores across the grid to dispatch prioritized, actionable alerts ranging from early advisories to critical, immediate-action escalations.

## 10. Technology Stack
**Frontend:**
- React 18, TypeScript, Vite
- Leaflet (GIS/Map Visualization)
- Vanilla CSS (Glassmorphism & Weather UI)

**Backend:**
- Python 3
- FastAPI, Uvicorn
- Pandas, NumPy (Data Engine)

**Deployment:**
- Vercel (Decoupled Architecture)

## 11. Data Sources / Provider Architecture
The system employs a flexible provider architecture designed to ingest data from:
- **Open-Meteo:** For baseline global numerical weather predictions.
- **Simulated Data Sources:** A robust internal engine used for SIH demonstration to emulate extreme convective events safely.
- *(Planned)* **INSAT / IMDAA / Local Radar:** Architecture is prepared to ingest Indian meteorological data feeds.

## 12. Demo Mode vs Live Data
**Note to Judges:** To guarantee a consistent and verifiable evaluation of the intelligence engine during the SIH presentation, the system is actively utilizing a high-fidelity synthetic demo adapter (`RAINGUARD_DATA_MODE=demo`). This ensures extreme weather anomalies and critical alerts trigger predictably, without depending on live, external satellite data feeds which may not present extreme conditions on the day of the hackathon.

## 13. Project Structure
```text
RainGuard-AI/
│
├── frontend/             # React/TypeScript GIS Dashboard
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/              # Python FastAPI Intelligence Engine
│   ├── app/
│   ├── requirements.txt
│   └── ...
│
├── README.md             # Project Documentation
├── .gitignore            # Git configurations
└── vercel.json           # Vercel Deployment Configuration
```

## 14. Running Locally

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
./start.sh
# API will run at http://localhost:8000
```

### Frontend Setup
Create `frontend/.env.local` (or `.env`) and add:
`VITE_API_BASE_URL=http://localhost:8000`

```bash
cd frontend
npm install
npm run dev
# Dashboard will run at http://localhost:5173
```

## 15. API / Backend
The backend serves as a standalone REST API providing intelligence data via the `/api/intelligence` endpoint. It processes the 900-cell grid dynamically upon request.

## 16. Frontend
The frontend is a decoupled React single-page application heavily optimized for responsive situational awareness. It queries the backend API and visualizes data across the integrated GIS Leaflet map.

## 17. Deployment
The application utilizes a split-project serverless deployment model via Vercel:
- **Judge-Facing Frontend:** [https://frontend-seven-snowy-80.vercel.app/](https://frontend-seven-snowy-80.vercel.app/)
- **Backend API:** [https://rainguard-ai-umber.vercel.app](https://rainguard-ai-umber.vercel.app)

*(The frontend correctly routes API calls to the backend deployment using environment variables).*

## 18. Prototype Scope
- The prototype currently demonstrates the intelligence pipeline over a 900-cell Chennai grid.
- ML models and risk fusions are currently utilizing robust rule-based baseline methodologies to demonstrate the architectural flow while deep-learning models undergo further training.
- 2–6 hour lead times represent the operational objective for the final integrated system.

## 19. Future Roadmap
- Integration with live IMDAA NWP and INSAT satellite feeds.
- Replacement of rule-based baseline forecasts with deployed ConvLSTM models.
- Expansion of the grid beyond Chennai to PAN-India high-risk urban zones.

## 20. References
- Smart India Hackathon Guidelines
- Open-Meteo Documentation

## 21. Team
**Bharat Innovates** - Committed to building resilient disaster-management technology for a safer future.
