import {
  Activity,
  Cloud,
  Gauge,
  Wind,
  Zap,
} from "lucide-react";

interface AtmosphericIntelligencePanelProps {
  integratedWaterVapour: number;
  cape: number;
  cin: number;
  windConvergence: number;
  floodRisk: number;
}

function getRiskLevel(value: number): string {
  if (value >= 0.8) return "High";
  if (value >= 0.3) return "Moderate";
  return "Low";
}

function getCAPELevel(value: number): string {
  if (value >= 2500) return "Very High";
  if (value >= 1500) return "High";
  if (value >= 500) return "Moderate";
  return "Low";
}

function AtmosphericIntelligencePanel({
  integratedWaterVapour,
  cape,
  cin,
  windConvergence,
  floodRisk,
}: AtmosphericIntelligencePanelProps) {
  const convergenceLevel =
    getRiskLevel(windConvergence);

  const capeLevel = getCAPELevel(cape);

  return (
    <section className="atmospheric-intelligence-panel">
      <div className="atmospheric-panel-header">
        <div>

          <h2>Atmospheric Intelligence</h2>

          <p>
            Derived atmospheric indicators from the
            RainGuard processing pipeline.
          </p>
        </div>

        <div className="atmospheric-status">
          <Activity size={16} />
          <span>LIVE ANALYSIS</span>
        </div>
      </div>

      <div className="atmospheric-indicator-grid">

        {/* IWV */}
        <div className="atmospheric-indicator-card">
          <div className="atmospheric-indicator-icon">
            <Cloud size={20} />
          </div>

          <div className="atmospheric-indicator-content">
            <span className="atmospheric-indicator-label">
              Integrated Water Vapour
            </span>

            <strong>
              {integratedWaterVapour.toFixed(2)}
              <small> kg/m²</small>
            </strong>

            <span className="atmospheric-indicator-description">
              Total atmospheric moisture column
            </span>
          </div>
        </div>

        {/* CAPE */}
        <div className="atmospheric-indicator-card">
          <div className="atmospheric-indicator-icon">
            <Zap size={20} />
          </div>

          <div className="atmospheric-indicator-content">
            <span className="atmospheric-indicator-label">
              CAPE
            </span>

            <strong>
              {cape.toFixed(0)}
              <small> J/kg</small>
            </strong>

            <span className="atmospheric-indicator-description">
              Convective instability: {capeLevel}
            </span>
          </div>
        </div>

        {/* CIN */}
        <div className="atmospheric-indicator-card">
          <div className="atmospheric-indicator-icon">
            <Gauge size={20} />
          </div>

          <div className="atmospheric-indicator-content">
            <span className="atmospheric-indicator-label">
              CIN
            </span>

            <strong>
              {cin.toFixed(0)}
              <small> J/kg</small>
            </strong>

            <span className="atmospheric-indicator-description">
              Convective inhibition
            </span>
          </div>
        </div>

        {/* Wind Convergence */}
        <div className="atmospheric-indicator-card">
          <div className="atmospheric-indicator-icon">
            <Wind size={20} />
          </div>

          <div className="atmospheric-indicator-content">
            <span className="atmospheric-indicator-label">
              Wind Convergence
            </span>

            <strong>
              {windConvergence.toFixed(2)}
            </strong>

            <span className="atmospheric-indicator-description">
              Convergence level: {convergenceLevel}
            </span>
          </div>
        </div>

        {/* Flood Risk */}
        <div className="atmospheric-indicator-card">
          <div className="atmospheric-indicator-icon">
            <Activity size={20} />
          </div>

          <div className="atmospheric-indicator-content">
            <span className="atmospheric-indicator-label">
              Atmospheric Flood Risk
            </span>

            <strong>
              {floodRisk}
              <small> / 100</small>
            </strong>

            <span className="atmospheric-indicator-description">
              Combined atmospheric risk indicator
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default AtmosphericIntelligencePanel;