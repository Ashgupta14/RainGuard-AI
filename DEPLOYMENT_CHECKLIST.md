# RainGuard AI — Deployment Checklist

## Backend
- [x] Python dependencies installed
- [x] Environment variables configured
- [x] FastAPI starts successfully
- [x] /health returns 200
- [x] /health/intelligence returns 200
- [x] /health/providers returns 200
- [x] /api/intelligence returns 900 cells
- [x] Demo mode verified
- [x] Live/fallback behavior verified

## Frontend
- [x] npm install succeeds
- [x] TypeScript compilation succeeds
- [x] Production build succeeds
- [x] API base URL configured
- [x] Dashboard loads
- [x] Risk Map loads
- [x] Alerts load
- [x] System Status loads
- [x] Browser console clean

## Intelligence
- [x] Atmospheric intelligence
- [x] Rainfall intelligence
- [x] Future risk
- [x] Ground impact
- [x] Time-to-impact
- [x] Decision engine
- [x] Historical intelligence
- [x] What-if simulation
- [x] Feedback/evaluation
- [x] Data provenance
- [x] Source fusion provenance

## Safety
- [x] No fake satellite LIVE status
- [x] No fake radar LIVE status
- [x] No fabricated ML accuracy
- [x] Demo data clearly identified
- [x] Provider failure falls back safely
