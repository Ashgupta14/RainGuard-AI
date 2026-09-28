import {
  Activity,
  CheckCircle2,
  Database,
  Server,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchIntelligence, ApiDataSourceStatus, ApiProviderStatus, fetchEvaluation, fetchCalibration, ApiEvaluationSummary, ApiCalibrationSummary, ApiMLModelInfo } from "../services/api";
import {
  getDataModeLabel,
  getProviderLabel,
  getSourceStatus,
} from "../services/phase2IntelligenceAdapter";

function SystemStatus() {
  const [dataStatus, setDataStatus] = useState<ApiDataSourceStatus | null>(null);
  const [providerStatus, setProviderStatus] = useState<ApiProviderStatus | null>(null);
  const [evalSummary, setEvalSummary] = useState<ApiEvaluationSummary | null>(null);
  const [calSummary, setCalSummary] = useState<ApiCalibrationSummary | null>(null);
  const [modelInfo, setModelInfo] = useState<ApiMLModelInfo | null>(null);

  useEffect(() => {
    async function loadDataStatus() {
      try {
        const intelligence =
          await fetchIntelligence();

        setDataStatus(intelligence.data_status);
        setProviderStatus(intelligence.provider_status);
        if (intelligence.cells && intelligence.cells.length > 0 && intelligence.cells[0].model) {
            setModelInfo(intelligence.cells[0].model);
        }
      } catch (error) {
        console.error(
          "Failed to load data-source status:",
          error
        );
      }
    }

    loadDataStatus();

    async function loadEval() {
      try {
        const evalData = await fetchEvaluation();
        setEvalSummary(evalData);
      } catch (e) {
        console.error(e);
      }
      try {
        const calData = await fetchCalibration();
        setCalSummary(calData);
      } catch (e) {
        console.error(e);
      }
    }
    loadEval();
  }, []);

  return (
    <div className="module-page">
      <div className="module-header">
        <div>
          <p className="dashboard-kicker">
            SYSTEM MONITORING
          </p>

          <h2>System Status</h2>

          <p>
            Current operational status of RainGuard AI
            services.
          </p>
        </div>

        <div className="module-status">
          <span className="status-dot"></span>
          All Systems Operational
        </div>
      </div>

      <div className="module-grid">

        <div className="module-card">
          <Server size={26} />

          <h3>Application Server</h3>

          <p>
            RainGuard frontend is operating normally.
          </p>

          <div className="status-check">
            <CheckCircle2 size={15} />
            Operational
          </div>
        </div>

        <div className="module-card">
          <Database size={26} />

          <h3>Weather Data Service</h3>

          {dataStatus && providerStatus ? (
            <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5", marginBottom: "1.5rem" }}>
              <div style={{ marginBottom: "8px" }}>
                <strong style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>DATA MODE</strong>
                <br/>
                {getDataModeLabel(dataStatus)}
              </div>
              
              <div style={{ marginBottom: "8px" }}>
                <strong style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>PROVIDER</strong>
                <br/>
                {getProviderLabel(providerStatus)}
              </div>
              
              <div style={{ marginBottom: "8px" }}>
                <strong style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>STATUS</strong>
                <br/>
                {getSourceStatus(providerStatus)}
              </div>
              
              <div style={{ marginBottom: "8px" }}>
                <strong style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>COVERAGE</strong>
                <br/>
                {providerStatus.coverage}%
              </div>
              
              <div style={{ marginBottom: "8px" }}>
                <strong style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>QUALITY</strong>
                <br/>
                {providerStatus.quality}%
              </div>
              
              <div style={{ marginBottom: "8px" }}>
                <strong style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>FALLBACK</strong>
                <br/>
                {dataStatus.fallback_used ? "Active" : "Available"}
              </div>
            </div>
          ) : (
            <p>
              Weather data service is currently using demo
              data.
            </p>
          )}

          <div className="status-check">
            <CheckCircle2 size={15} />
            Available
          </div>
        </div>

        <div className="module-card">
          <Wifi size={26} />

          <h3>Network</h3>

          <p>
            Application network connection is available.
          </p>

          <div className="status-check">
            <CheckCircle2 size={15} />
            Connected
          </div>
        </div>

        <div className="module-card">
          <Activity size={26} />

          <h3>Model Status</h3>

          <p>
            {modelInfo ? modelInfo.name : "Prototype / Rule-Based"}
          </p>
          
          <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5", marginBottom: "1.5rem" }}>
            <div style={{ marginBottom: "8px" }}>
              <strong style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>STATUS</strong>
              <br/>
              {modelInfo ? (modelInfo.type === 'rule-based' ? "Prototype" : "Production") : "Prototype"}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <strong style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>TRAINING</strong>
              <br/>
              {modelInfo && modelInfo.trained ? "Trained" : "Not trained"}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <strong style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>EVALUATION</strong>
              <br/>
              {evalSummary?.forecast_evaluation.evaluation_status === 'insufficient_data' ? "Insufficient historical labels" : "Evaluated"}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <strong style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>CALIBRATION</strong>
              <br/>
              {calSummary?.suggestions && calSummary.suggestions.length > 0 ? "Manual review required" : "Up to date"}
            </div>
          </div>

          <div className="status-check">
            <CheckCircle2 size={15} />
            Ready
          </div>
        </div>

      </div>
    </div>
  );
}

export default SystemStatus;