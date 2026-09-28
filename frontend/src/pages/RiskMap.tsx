import { useEffect, useMemo, useState } from "react";

import {
  AlertTriangle,
  CloudRain,
  Layers,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import {
  fetchIntelligence,
  type ApiGridCellIntelligence,
  type IntelligenceApiResponse,
} from "../services/api";

import {
  getDominantHazard,
  getRiskConfidence,
} from "../services/intelligencePresentationService";

import { adaptPhase2Intelligence } from "../services/phase2IntelligenceAdapter";


type RiskLevel =
  | "Low"
  | "Moderate"
  | "High"
  | "Critical";


/*
 * ---------------------------------------------------------
 * HELPERS
 * ---------------------------------------------------------
 */

function normalizeRiskLevel(
  level: string
): RiskLevel {

  if (level === "Critical") {
    return "Critical";
  }

  if (level === "High") {
    return "High";
  }

  if (level === "Moderate") {
    return "Moderate";
  }

  return "Low";
}


function getRiskClass(
  level: RiskLevel
): string {

  return level
    .toLowerCase()
    .replace(" ", "-");
}


function findBackendCell(
  cells: ApiGridCellIntelligence[],
  cellId: string
): ApiGridCellIntelligence | undefined {
  return cells.find(
    (item) => item.cell.id === cellId
  );
}


/*
 * ---------------------------------------------------------
 * COMPONENT
 * ---------------------------------------------------------
 */

function RiskMap() {

  const [
    riskLayerEnabled,
    setRiskLayerEnabled,
  ] = useState(true);


  const [
    rainfallLayerEnabled,
    setRainfallLayerEnabled,
  ] = useState(true);


  const [
    zoom,
    setZoom,
  ] = useState(1);


  const [
    selectedCellId,
    setSelectedCellId,
  ] =
    useState<string | null>(
      null
    );

  const [
    intelligence,
    setIntelligence,
  ] =
    useState<
      IntelligenceApiResponse | null
    >(null);

  const selectedCell = useMemo(() => {
    if (!intelligence || !selectedCellId) return null;
    return findBackendCell(intelligence.cells, selectedCellId) ?? null;
  }, [intelligence, selectedCellId]);


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
   * LOAD BACKEND INTELLIGENCE
   * -------------------------------------------------------
   */

  useEffect(() => {

    async function loadIntelligence() {

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
          "Failed to load risk map intelligence:",
          err
        );

        setError(
          "Unable to load live risk intelligence."
        );

      } finally {

        setLoading(false);

      }

    }

    loadIntelligence();

  }, []);


  /*
   * -------------------------------------------------------
   * ZOOM
   * -------------------------------------------------------
   */

  function zoomIn() {

    setZoom((value) =>
      Math.min(
        value + 0.15,
        1.8
      )
    );
  }


  function zoomOut() {

    setZoom((value) =>
      Math.max(
        value - 0.15,
        0.7
      )
    );
  }


  function resetView() {

    setZoom(1);

    setSelectedCellId(
      null
    );
  }


  /*
   * -------------------------------------------------------
   * GRID DIMENSIONS
   * -------------------------------------------------------
   */

  const gridColumns =
    intelligence?.grid_columns ??
    30;

  const gridRows =
    intelligence?.grid_rows ??
    30;


  /*
   * -------------------------------------------------------
   * GRID CELLS
   * -------------------------------------------------------
   */

  const cells =
    intelligence?.cells ?? [];


  /*
   * -------------------------------------------------------
   * SORT CELLS
   * -------------------------------------------------------
   *
   * The backend normally returns row/column order,
   * but sorting by ID gives the visual grid a stable
   * deterministic order.
   */

  const sortedCells =
    useMemo(() => {

      return [...cells].sort(
        (a, b) =>
          a.cell.id.localeCompare(
            b.cell.id,
            undefined,
            {
              numeric: true,
            }
          )
      );

    }, [cells]);


  /*
   * -------------------------------------------------------
   * MAP SUMMARY
   * -------------------------------------------------------
   */

  const highestRisk =
    intelligence?.summary
      .highest_risk_level ??
    "Low";


  const totalCells =
    intelligence?.summary
      .total_cells ??
    gridRows *
      gridColumns;


  const populatedCells =
    intelligence?.summary
      .populated_cells ??
    0;


  /*
   * -------------------------------------------------------
   * RENDER
   * -------------------------------------------------------
 */

  return (

    <div className="module-page">

      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="module-header">

        <div>

          <p className="dashboard-kicker">
            SPATIAL INTELLIGENCE
          </p>

          <h2>
            Flood Risk Map
          </h2>

          <p>
            GIS-based visualization of rainfall and
            flood-risk conditions.
          </p>

        </div>


        <div className="module-status">

          <span className="status-dot"></span>

          {loading
            ? "Loading Intelligence"
            : error
            ? "Intelligence Offline"
            : "GIS Monitoring Active"}

        </div>

      </div>


      {/* ==================================================
          MAP TOOLBAR
          ================================================== */}

      <div className="risk-map-toolbar">

        <div className="risk-map-layers">

          <span className="risk-map-toolbar-label">

            <Layers size={14} />

            MAP LAYERS

          </span>


          <button
            type="button"
            className={`map-layer-button ${
              riskLayerEnabled
                ? "active"
                : ""
            }`}
            onClick={() =>
              setRiskLayerEnabled(
                !riskLayerEnabled
              )
            }
          >

            <ShieldCheck size={15} />

            Flood Risk

            <span
              className={`layer-switch ${
                riskLayerEnabled
                  ? "on"
                  : ""
              }`}
            >
              <span></span>
            </span>

          </button>


          <button
            type="button"
            className={`map-layer-button ${
              rainfallLayerEnabled
                ? "active"
                : ""
            }`}
            onClick={() =>
              setRainfallLayerEnabled(
                !rainfallLayerEnabled
              )
            }
          >

            <CloudRain size={15} />

            Rainfall

            <span
              className={`layer-switch ${
                rainfallLayerEnabled
                  ? "on"
                  : ""
              }`}
            >
              <span></span>
            </span>

          </button>

        </div>


        <div className="map-controls">

          <button
            type="button"
            onClick={zoomOut}
            aria-label="Zoom out"
          >
            <Minus size={16} />
          </button>


          <span>
            {Math.round(
              zoom * 100
            )}%
          </span>


          <button
            type="button"
            onClick={zoomIn}
            aria-label="Zoom in"
          >
            <Plus size={16} />
          </button>


          <button
            type="button"
            onClick={resetView}
            aria-label="Reset map"
          >
            <RotateCcw size={15} />
          </button>

        </div>

      </div>


      {/* ==================================================
          MAP
          ================================================== */}

      <div className="risk-map-wrapper">

        <div
          className="risk-map"
          style={{
            transform:
              `scale(${zoom})`,
          }}
        >

          {/* ---------------------------------------------
              BASE MAP
              --------------------------------------------- */}

          <div className="map-grid"></div>


          <div className="map-road road-one"></div>

          <div className="map-road road-two"></div>

          <div className="map-road road-three"></div>


          {/* ---------------------------------------------
              RAINFALL LAYER
              --------------------------------------------- */}

          {rainfallLayerEnabled && (

            <>

              <div className="rainfall-overlay rainfall-one"></div>

              <div className="rainfall-overlay rainfall-two"></div>

              <div className="rainfall-overlay rainfall-three"></div>

            </>

          )}


          {/* ---------------------------------------------
              BACKEND 30 × 30 RISK GRID
              --------------------------------------------- */}

          {riskLayerEnabled && (

            <div
              style={{
                position:
                  "absolute",

                inset: 0,

                display:
                  "grid",

                gridTemplateColumns:
                  `repeat(${gridColumns}, minmax(0, 1fr))`,

                gridTemplateRows:
                  `repeat(${gridRows}, minmax(0, 1fr))`,

                zIndex: 4,

                pointerEvents:
                  "auto",
              }}
              aria-label="30 by 30 flood risk intelligence grid"
            >

              {sortedCells.map(
                (cell) => {

                  const level =
                    normalizeRiskLevel(
                      cell.risk.level
                    );


                  const selected =
                    selectedCell?.cell.id ===
                    cell.cell.id;


                  return (

                    <button
                      key={
                        cell.cell.id
                      }
                      type="button"
                      className={`risk-zone ${getRiskClass(
                        level
                      )}`}
                      style={{
                        position:
                          "relative",

                        left:
                          "auto",

                        top:
                          "auto",

                        width:
                          "100%",

                        height:
                          "100%",

                        minWidth:
                          0,

                        minHeight:
                          0,

                        borderRadius:
                          0,

                        transform:
                          "none",

                        opacity:
                          rainfallLayerEnabled
                            ? 0.78
                            : 0.68,

                        zIndex:
                          selected
                            ? 3
                            : 1,

                        outline:
                          selected
                            ? "2px solid white"
                            : "none",

                        outlineOffset:
                          "-2px",
                      }}
                      onClick={() =>
                        setSelectedCellId(
                          cell.cell.id
                        )
                      }
                      aria-label={`${
                        cell.cell.id
                      }, ${
                        level
                      } flood risk, score ${
                        cell.risk.score
                      }`}
                    >

                      <span></span>

                    </button>

                  );

                }
              )}

            </div>

          )}


          {/* ---------------------------------------------
              MONITORING LOCATIONS
              --------------------------------------------- */}

          <button
            type="button"
            className="monitoring-marker marker-one"
            onClick={() =>
              setSelectedCellId(null)
            }
          >
            <MapPin size={17} />
          </button>


          <button
            type="button"
            className="monitoring-marker marker-two"
            onClick={() =>
              setSelectedCellId(null)
            }
          >
            <MapPin size={17} />
          </button>


          {/* ---------------------------------------------
              MAP LABEL
              --------------------------------------------- */}

          <div className="map-label central-label">

            CHENNAI 30 × 30
            MONITORING GRID

          </div>

        </div>


        {/* =================================================
            MAP LEGEND
            ================================================= */}

        <div className="map-legend">

          <strong>
            Flood Risk
          </strong>


          <div>

            <span className="legend-dot low"></span>

            Low

          </div>


          <div>

            <span className="legend-dot moderate"></span>

            Moderate

          </div>


          <div>

            <span className="legend-dot high"></span>

            High

          </div>


          <div>

            <span className="legend-dot critical"></span>

            Critical

          </div>

        </div>


        {/* =================================================
            LOADING STATE
            ================================================= */}

        {loading && (

          <div className="map-zone-info">

            <div className="map-zone-info-header">

              <div>

                <span>
                  SYSTEM STATUS
                </span>

                <strong>
                  Loading Risk Intelligence
                </strong>

              </div>

            </div>

            <p>
              Retrieving the 30 × 30 atmospheric
              intelligence grid from RainGuard AI.
            </p>

          </div>

        )}


        {/* =================================================
            ERROR STATE
            ================================================= */}

        {!loading &&
          error && (

            <div className="map-zone-info">

              <div className="map-zone-info-header">

                <div>

                  <span>
                    SYSTEM STATUS
                  </span>

                  <strong>
                    Risk Intelligence Unavailable
                  </strong>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setError(null)
                  }
                  aria-label="Close error"
                >
                  ×
                </button>

              </div>

              <p>
                {error}
              </p>

            </div>

          )}


        {/* =================================================
            SELECTED CELL
            ================================================= */}

        {selectedCell && (

          <div className="map-zone-info">

            <div className="map-zone-info-header">

              <div>

                <span>
                  SELECTED GRID CELL
                </span>

                <strong>
                  {selectedCell.cell.id}
                </strong>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedCellId(
                    null
                  )
                }
                aria-label="Close cell information"
              >
                ×
              </button>

            </div>


            <div className="map-zone-risk">

              <AlertTriangle size={17} />

              <div>

                <span>
                  Risk Classification
                </span>

                <strong>
                  {selectedCell.risk.level}
                </strong>

              </div>

            </div>

            {(() => {
              const phase2 = adaptPhase2Intelligence(selectedCell);
              return (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginTop: "14px",
                  }}
                >
                  <div>
                    <span>Atmos Risk Score</span>
                    <strong>{selectedCell.risk.score}/100</strong>
                  </div>
                  <div>
                    <span>Classification</span>
                    <strong>{selectedCell.risk.level}</strong>
                  </div>
                  <div>
                    <span>Confidence</span>
                    <strong>{getRiskConfidence(selectedCell)}%</strong>
                  </div>
                  <div>
                    <span>Dominant Hazard</span>
                    <strong>{getDominantHazard(selectedCell)}</strong>
                  </div>
                  
                  {phase2.hasPhase2Data && (
                    <>
                      <div>
                        <span>Ground Impact</span>
                        <strong>{phase2.groundImpactLevel} ({phase2.groundImpactScore}/100)</strong>
                      </div>
                      <div>
                        <span>Future Risk</span>
                        <strong>{phase2.futureRiskLevel} ({phase2.futureRiskScore}/100)</strong>
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <span>Time to Impact</span>
                        <strong>{phase2.timeToImpactWindow}</strong>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap:
                  "10px",
                marginTop:
                  "14px",
              }}
            >
              <div>
                <span>Rainfall</span>
                <strong>{selectedCell.cell.rainfall ?? "—"} mm/hr</strong>
              </div>

              <div>
                <span>IWV</span>
                <strong>{selectedCell.cell.integrated_water_vapour ?? "—"} kg/m²</strong>
              </div>

              <div>
                <span>CAPE</span>
                <strong>{selectedCell.cell.cape ?? "—"} J/kg</strong>
              </div>

              <div>
                <span>CIN</span>
                <strong>{selectedCell.cell.cin ?? "—"} J/kg</strong>
              </div>

              <div>
                <span>Wind Convergence</span>
                <strong>{selectedCell.cell.wind_convergence ?? "—"}</strong>
              </div>
            </div>

            {selectedCell.risk.contributing_factors.length > 0 && (
              <div style={{ marginTop: "14px" }}>
                <div style={{ marginBottom: "6px" }}>Key Drivers</div>
                {selectedCell.risk.contributing_factors.map((factor, index) => (
                  <div key={`${factor}-${index}`}>• {factor}</div>
                ))}
              </div>
            )}

            <p style={{ marginTop: "14px" }}>
              Location:{" "}
              {selectedCell.cell.latitude.toFixed(
                4
              )}
              °N,{" "}
              {selectedCell.cell.longitude.toFixed(
                4
              )}
              °E
            </p>

          </div>

        )}

      </div>


      {/* ==================================================
          MAP INFORMATION
          ================================================== */}

      <div className="risk-map-info-grid">

        <div>

          <MapPin size={18} />

          <span>
            Intelligence Grid
          </span>

          <strong>
            {gridRows} × {gridColumns}
          </strong>

        </div>


        <div>

          <CloudRain size={18} />

          <span>
            Rainfall Layer
          </span>

          <strong>
            {rainfallLayerEnabled
              ? "Visible"
              : "Hidden"}
          </strong>

        </div>


        <div>

          <ShieldCheck size={18} />

          <span>
            Risk Layer
          </span>

          <strong>
            {riskLayerEnabled
              ? "Visible"
              : "Hidden"}
          </strong>

        </div>


        <div>

          <AlertTriangle size={18} />

          <span>
            Highest Risk
          </span>

          <strong>
            {highestRisk}
          </strong>

        </div>


        <div>

          <MapPin size={18} />

          <span>
            Grid Coverage
          </span>

          <strong>
            {populatedCells}/{totalCells}
          </strong>

        </div>

      </div>

    </div>
  );
}


export default RiskMap;