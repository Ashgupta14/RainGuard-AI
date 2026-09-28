import { useEffect, useMemo, useState } from "react";

import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldAlert,
  X,
} from "lucide-react";

import {
  fetchIntelligence,
  type ApiAlert,
  type ApiGridCellIntelligence,
  type IntelligenceApiResponse,
} from "../services/api";

import {
  getAlertLeadWindow,
  getAlertSummary,
} from "../services/intelligencePresentationService";

import { adaptPhase2Intelligence } from "../services/phase2IntelligenceAdapter";


/*
 * ---------------------------------------------------------
 * FRONTEND ALERT SEVERITY
 * ---------------------------------------------------------
 */

type AlertSeverity =
  | "Critical"
  | "High"
  | "Moderate";


/*
 * ---------------------------------------------------------
 * FRONTEND ALERT MODEL
 * ---------------------------------------------------------
 */

interface AlertItem {

  id: string;

  severity: AlertSeverity;

  title: string;

  location: string;

  time: string;

  description: string;

  rainfall: string;

  floodRisk: string;

  hazard: string;

  timeToImpact: string;

  action: string;

  confidence: number;

}


/*
 * ---------------------------------------------------------
 * HELPERS
 * ---------------------------------------------------------
 */

function mapSeverity(
  severity: string
): AlertSeverity {

  /*
   * Backend:
   *
   * Emergency → Critical
   * Warning   → High
   * Watch     → Moderate
   * Advisory  → Moderate
   */

  if (
    severity === "Emergency"
  ) {
    return "Critical";
  }

  if (
    severity === "Warning"
  ) {
    return "High";
  }

  return "Moderate";
}


function getAlertTitle(
  alert: ApiAlert
): string {

  /*
   * The backend already generates
   * a useful headline.
   */

  return alert.headline;
}


function formatTime(
  timestamp: string
): string {

  const date =
    new Date(timestamp);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "--";
  }

  return date.toLocaleTimeString(
    [],
    {
      hour:
        "2-digit",

      minute:
        "2-digit",
    }
  );
}


function getCell(
  response: IntelligenceApiResponse,
  cellId: string
): ApiGridCellIntelligence | undefined {

  return response.cells.find(
    (cell) =>
      cell.cell.id ===
      cellId
  );
}


/*
 * ---------------------------------------------------------
 * API ALERT → UI ALERT
 * ---------------------------------------------------------
 */

function adaptAlert(
  alert: ApiAlert,
  response: IntelligenceApiResponse
): AlertItem {

  const cell =
    getCell(
      response,
      alert.cell_id
    );


  const rainfall =
    cell?.cell.rainfall;


  const timeToImpact =
    alert.time_to_impact
      ?.window_label ??
    "Assessment unavailable";


  const confidence =
    alert.confidence ?? 0;


  return {

    id:
      alert.id,

    severity:
      mapSeverity(
        alert.severity
      ),

    title:
      getAlertTitle(
        alert
      ),

    location:
      `${alert.cell_id} — Chennai Monitoring Grid`,

    time:
      formatTime(
        alert.generated_at
      ),

    description:
      alert.message,

    rainfall:
      rainfall !== undefined
        ? `${rainfall.toFixed(
            1
          )} mm/hr`
        : "N/A",

    floodRisk:
      `${alert.risk_score}%`,

    hazard:
      alert.hazard,

    timeToImpact,

    action:
      alert.action,

    confidence,
  };
}


/*
 * ---------------------------------------------------------
 * COMPONENT
 * ---------------------------------------------------------
 */

function Alerts() {

  const [
    filter,
    setFilter,
  ] = useState<
    "All" | AlertSeverity
  >("All");


  const [
    selectedAlert,
    setSelectedAlert,
  ] =
    useState<ApiAlert | null>(
      null
    );


  const [
    acknowledgedAlerts,
    setAcknowledgedAlerts,
  ] = useState<string[]>(
    []
  );


  const [
    intelligence,
    setIntelligence,
  ] =
    useState<
      IntelligenceApiResponse | null
    >(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  /*
   * -------------------------------------------------------
   * LOAD BACKEND ALERTS
   * -------------------------------------------------------
   */

  useEffect(() => {

    async function loadAlerts() {

      try {

        setLoading(true);

        const response =
          await fetchIntelligence(
            "Chennai Monitoring Zone"
          );

        setIntelligence(
          response
        );

        setError(null);

      } catch (err) {

        console.error(
          "Failed to load RainGuard alerts:",
          err
        );

        setError(
          "Unable to load current RainGuard alerts."
        );

      } finally {

        setLoading(false);

      }

    }

    loadAlerts();

  }, []);


  /*
   * -------------------------------------------------------
   * ADAPTED ALERTS
   * -------------------------------------------------------
   */

  const alertData =
    useMemo(() => {

      if (!intelligence) {
        return [];
      }

      return intelligence.alerts.map(
        (alert) =>
          adaptAlert(
            alert,
            intelligence
          )
      );

    }, [intelligence]);


  /*
   * -------------------------------------------------------
   * FILTER
   * -------------------------------------------------------
   */

  const filteredAlerts =
    useMemo(() => {

      if (
        filter === "All"
      ) {
        return alertData;
      }

      return alertData.filter(
        (alert) =>
          alert.severity ===
          filter
      );

    }, [
      alertData,
      filter,
    ]);


  /*
   * -------------------------------------------------------
   * SUMMARY COUNTS
   * -------------------------------------------------------
   */

  const criticalCount =
    alertData.filter(
      (alert) =>
        alert.severity ===
        "Critical"
    ).length;


  const highCount =
    alertData.filter(
      (alert) =>
        alert.severity ===
        "High"
    ).length;


  const moderateCount =
    alertData.filter(
      (alert) =>
        alert.severity ===
        "Moderate"
    ).length;


  /*
   * -------------------------------------------------------
   * ACKNOWLEDGE
   * -------------------------------------------------------
   */

  function acknowledgeAlert(
    id: string
  ) {

    setAcknowledgedAlerts(
      (current) =>
        current.includes(id)
          ? current
          : [
              ...current,
              id,
            ]
    );

  }


  /*
   * -------------------------------------------------------
   * ICON
   * -------------------------------------------------------
   */

  function getSeverityIcon(
    severity: AlertSeverity
  ) {

    if (
      severity ===
      "Critical"
    ) {

      return (
        <ShieldAlert
          size={19}
        />
      );

    }


    if (
      severity ===
      "High"
    ) {

      return (
        <AlertTriangle
          size={19}
        />
      );

    }


    return (
      <Bell
        size={19}
      />
    );
  }


  /*
   * -------------------------------------------------------
   * RENDER
   * -------------------------------------------------------
   */

  return (

    <section className="alerts-page">

      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="alerts-header">

        <div>

          <span className="page-eyebrow">
            EARLY WARNING SYSTEM
          </span>

          <h1>
            Alerts & Warnings
          </h1>

          <p>
            Real-time weather and flood-risk alerts
            generated for monitored areas.
          </p>

        </div>


        <div className="alerts-status">

          <span className="alerts-status-dot" />

          {loading
            ? "Loading Intelligence"
            : error
            ? "Monitoring Unavailable"
            : "Monitoring Active"}

        </div>

      </div>


      {/* ==================================================
          SUMMARY
          ================================================== */}

      <div className="alerts-summary-grid">

        <article className="alerts-summary-card">

          <div className="alerts-summary-icon red">

            <ShieldAlert
              size={20}
            />

          </div>


          <div>

            <span>
              Critical Alerts
            </span>

            <strong>
              {criticalCount}
            </strong>

            <small>
              Immediate attention
            </small>

          </div>

        </article>


        <article className="alerts-summary-card">

          <div className="alerts-summary-icon orange">

            <AlertTriangle
              size={20}
            />

          </div>


          <div>

            <span>
              High Alerts
            </span>

            <strong>
              {highCount}
            </strong>

            <small>
              Enhanced monitoring
            </small>

          </div>

        </article>


        <article className="alerts-summary-card">

          <div className="alerts-summary-icon yellow">

            <Bell
              size={20}
            />

          </div>


          <div>

            <span>
              Moderate Alerts
            </span>

            <strong>
              {moderateCount}
            </strong>

            <small>
              Continue observation
            </small>

          </div>

        </article>


        <article className="alerts-summary-card">

          <div className="alerts-summary-icon green">

            <CheckCircle2
              size={20}
            />

          </div>


          <div>

            <span>
              Acknowledged
            </span>

            <strong>
              {
                acknowledgedAlerts.length
              }
            </strong>

            <small>
              Alerts reviewed
            </small>

          </div>

        </article>

      </div>


      {/* ==================================================
          ALERT LIST
          ================================================== */}

      <article className="alerts-panel">

        <div className="alerts-panel-header">

          <div>

            <h2>
              Active Alerts
            </h2>

            <p>
              Current warnings requiring monitoring or response.
            </p>

          </div>


          <div className="alert-filter">

            {(
              [
                "All",
                "Critical",
                "High",
                "Moderate",
              ] as const
            ).map(
              (item) => (

                <button
                  type="button"
                  key={item}
                  className={
                    filter === item
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setFilter(
                      item
                    )
                  }
                >

                  {item}

                </button>

              )
            )}

          </div>

        </div>


        <div className="alerts-list">

          {/* ---------------------------------------------
              LOADING
              --------------------------------------------- */}

          {loading && (

            <div className="alerts-empty">

              <Bell
                size={28}
              />

              <strong>
                Loading RainGuard alerts
              </strong>

              <span>
                Evaluating the current atmospheric
                intelligence grid.
              </span>

            </div>

          )}


          {/* ---------------------------------------------
              ERROR
              --------------------------------------------- */}

          {!loading &&
            error && (

              <div className="alerts-empty">

                <AlertTriangle
                  size={28}
                />

                <strong>
                  Alert intelligence unavailable
                </strong>

                <span>
                  {error}
                </span>

              </div>

            )}


          {/* ---------------------------------------------
              ALERTS
              --------------------------------------------- */}

          {!loading &&
            !error &&
            filteredAlerts.map(
              (alert) => {

                const acknowledged =
                  acknowledgedAlerts.includes(
                    alert.id
                  );


                return (

                  <article
                    className={`alert-item ${
                      alert.severity.toLowerCase()
                    } ${
                      acknowledged
                        ? "acknowledged"
                        : ""
                    }`}
                    key={
                      alert.id
                    }
                  >

                    <div
                      className={`alert-severity-icon ${
                        alert.severity.toLowerCase()
                      }`}
                    >

                      {getSeverityIcon(
                        alert.severity
                      )}

                    </div>


                    <div className="alert-main">

                      <div className="alert-title-row">

                        <div>

                          <span
                            className={`alert-badge ${
                              alert.severity.toLowerCase()
                            }`}
                          >

                            {
                              alert.severity
                            }

                          </span>


                          <h3>
                            {alert.title}
                          </h3>

                        </div>


                        <span className="alert-time">

                          <Clock3
                            size={13}
                          />

                          {alert.time}

                        </span>

                      </div>


                      <div className="alert-location">

                        <MapPin
                          size={13}
                        />

                        {alert.location}

                      </div>


                      <p>
                        {alert.description}
                      </p>


                      <div className="alert-data-row">

                        <span>

                          Rainfall{" "}

                          <strong>
                            {alert.rainfall}
                          </strong>

                        </span>


                        <span>

                          Flood Risk{" "}

                          <strong>
                            {alert.floodRisk}
                          </strong>

                        </span>

                      </div>

                    </div>


                    <div className="alert-actions">

                      <button
                        type="button"
                        className="alert-details-button"
                        onClick={() => {
                          const apiAlert = intelligence?.alerts.find((a) => a.id === alert.id);
                          setSelectedAlert(apiAlert ?? null);
                        }}
                      >

                        View Details

                      </button>


                      <button
                        type="button"
                        className={`alert-ack-button ${
                          acknowledged
                            ? "done"
                            : ""
                        }`}
                        onClick={() =>
                          acknowledgeAlert(
                            alert.id
                          )
                        }
                        disabled={
                          acknowledged
                        }
                      >

                        {acknowledged ? (

                          <>
                            <CheckCircle2
                              size={14}
                            />

                            Acknowledged
                          </>

                        ) : (

                          "Acknowledge"

                        )}

                      </button>

                    </div>

                  </article>

                );

              }
            )}

        </div>


        {!loading &&
          !error &&
          filteredAlerts.length ===
            0 && (

            <div className="alerts-empty">

              <CheckCircle2
                size={28}
              />

              <strong>
                No active alerts in this category
              </strong>

              <span>
                There are currently no alerts matching
                the selected filter.
              </span>

            </div>

          )}

      </article>


      {/* ==================================================
          SYSTEM NOTICE
          ================================================== */}

      <div className="alerts-system-notice">

        <div>

          <CheckCircle2
            size={17}
          />

        </div>


        <p>

          <strong>
            Alert system operational.
          </strong>{" "}

          Monitoring services are actively evaluating
          rainfall, atmospheric conditions and
          flood-risk indicators.

        </p>

      </div>


      {/* ==================================================
          DETAILS MODAL
          ================================================== */}

      {selectedAlert && (

        <div
          className="alert-modal-backdrop"
          onClick={() =>
            setSelectedAlert(
              null
            )
          }
        >

          <div
            className="alert-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="alert-modal-header">

              <div>

                <span
                  className={`alert-badge ${
                    selectedAlert.severity.toLowerCase()
                  }`}
                >
                  {selectedAlert.severity} Alert
                </span>

                <h2>
                  {selectedAlert.headline}
                </h2>

              </div>

              <button
                type="button"
                className="alert-modal-close"
                onClick={() =>
                  setSelectedAlert(
                    null
                  )
                }
                aria-label="Close alert details"
              >
                <X size={18} />
              </button>

            </div>

            <div className="alert-modal-location">
              <MapPin size={15} />
              {selectedAlert.cell_id} — Chennai Monitoring Grid
            </div>

            <div className="alert-modal-description">
              <div>
                <strong>Intelligence Summary</strong>
              </div>
              <p style={{ marginTop: "6px" }}>{getAlertSummary(selectedAlert)}</p>
            </div>

            <div className="alert-modal-metrics">
              <div>
                <span>Flood Probability</span>
                <strong>{selectedAlert.risk_score}%</strong>
              </div>

              <div>
                <span>Confidence</span>
                <strong>{selectedAlert.confidence}%</strong>
              </div>

              {selectedAlert.lead_window && (
                <div>
                  <span>Lead Window</span>
                  <strong>{getAlertLeadWindow(selectedAlert)}</strong>
                </div>
              )}

              {selectedAlert.lead_window && (
                <div>
                  <span>Urgency</span>
                  <strong>{selectedAlert.lead_window.urgency}</strong>
                </div>
              )}
            </div>
            
            {(() => {
              const selectedCell = intelligence?.cells.find((c) => c.cell.id === selectedAlert.cell_id);
              const phase2 = selectedCell ? adaptPhase2Intelligence(selectedCell) : null;
              
              return phase2?.hasPhase2Data ? (
                <>
                  <div className="alert-modal-metrics" style={{ marginTop: "14px" }}>
                    <div>
                      <span>Future Risk</span>
                      <strong>{phase2.futureRiskLevel} ({phase2.futureRiskScore}/100)</strong>
                    </div>
                    <div>
                      <span>Decision Priority</span>
                      <strong>{phase2.decisionPriority}</strong>
                    </div>
                    <div>
                      <span>Decision Severity</span>
                      <strong>{phase2.decisionSeverity}</strong>
                    </div>
                    <div>
                      <span>Time to Impact</span>
                      <strong>{phase2.timeToImpactWindow}</strong>
                    </div>
                  </div>
                  
                  <div className="alert-modal-description">
                    <div>
                      <strong>Explanation</strong>
                    </div>
                    <p style={{ marginTop: "6px", whiteSpace: "pre-wrap" }}>{phase2.decisionExplanation}</p>
                  </div>
                  
                  <div className="alert-modal-description">
                    <div>
                      <strong>Recommended Actions</strong>
                    </div>
                    <ul style={{ marginTop: "6px", paddingLeft: "20px", margin: "6px 0 0 20px" }}>
                      {phase2.recommendedActions.map((action, i) => (
                        <li key={i} style={{ marginBottom: "4px" }}>{action}</li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="alert-modal-description">
                  <div>
                    <strong>Recommended Action</strong>
                  </div>
                  <p style={{ marginTop: "6px" }}>{selectedAlert.action}</p>
                </div>
              );
            })()}


            <div className="alert-modal-footer">

              <span>

                <Clock3
                  size={13}
                />

                Latest assessment available

              </span>


              <button
                type="button"
                onClick={() => {

                  acknowledgeAlert(
                    selectedAlert.id
                  );

                  setSelectedAlert(
                    null
                  );

                }}
              >

                <CheckCircle2
                  size={14}
                />

                Acknowledge Alert

              </button>

            </div>

          </div>

        </div>

      )}

    </section>

  );
}


export default Alerts;