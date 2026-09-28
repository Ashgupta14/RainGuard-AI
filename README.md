# RainGuard AI

**AI-Driven Hyper-Local Early Warning System for Severe Weather Nowcasting**

This repository contains the RainGuard AI project developed by the Bharat Innovates team for Smart India Hackathon 2026 (SIH26077), focused on disaster-management intelligence for hyper-local flood risk and severe-weather nowcasting.

> This repository is a team-member copy of the project. Original project repository: https://github.com/ayushsingh-in/RainGuard_AI

## Project Overview
RainGuard AI converts atmospheric and ground-impact signals into hyper-local, time-bound flood-risk intelligence. It fuses meteorological inputs with vulnerability indicators and presents actionable warnings through a React GIS dashboard.

## Architecture
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

## Key Capabilities
- Real-time atmospheric monitoring
- Hyper-local flood-risk intelligence
- Severity-based alerts
- Explainable risk decisions
- 30 × 30 Chennai spatial grid prototype

## Technology Stack
**Frontend:** React 18, TypeScript, Vite, Leaflet, Vanilla CSS

**Backend:** Python 3, FastAPI, Uvicorn, Pandas, NumPy

**Deployment:** Vercel

## Data Providers
- Open-Meteo for baseline weather data
- Internal simulated/demo data for reproducible demonstrations
- Architecture prepared for future INSAT / IMDAA / local radar integrations

## Running Locally
### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
./start.sh
```

### Frontend
Create `frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

Then:
```bash
cd frontend
npm install
npm run dev
```

## Project Structure
```text
RainGuard-AI/
├── api/
├── backend/
│   ├── app/
│   └── tests/
├── frontend/
│   ├── public/
│   └── src/
├── DEPLOYMENT_CHECKLIST.md
├── requirements.txt
├── package.json
├── package-lock.json
├── vercel.json
└── README.md
```

## Team
**Bharat Innovates**

This repository is maintained as a team-member copy by **Ashgupta14**. Please refer to the source repository for the original project history and contributors.
