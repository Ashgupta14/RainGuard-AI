import {
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  CloudRain,
  Droplets,
  Gauge,
  MapPin,
  Wind,
} from "lucide-react";

import MetricCard from "../components/dashboard/MetricCard";
import RainfallChart from "../components/dashboard/RainfallChart";

import { getBackendWeatherData } from "../services/intelligenceAdapter";
import { fetchOperationalSummary, ApiOperationalSummary } from "../services/api";

import type { WeatherData } from "../types/weather";

import IndicatorDetailsModal from "../components/dashboard/IndicatorDetailsModal";
import RainfallDetailsModal from "../components/dashboard/RainfallDetailsModal";
import CurrentWeatherModal from "../components/dashboard/CurrentWeatherModal";

import AtmosphericIntelligencePanel from "../components/dashboard/AtmosphericPanel";

function getIwvStatus(
  value: number
): "Normal" | "Elevated" | "High" {

  if (value >= 55) {
    return "High";
  }

  if (value >= 40) {
    return "Elevated";
  }

  return "Normal";
}


function getCapeStatus(
  value: number
): "Stable" | "Moderate" | "Unstable" {

  if (value >= 1500) {
    return "Unstable";
  }

  if (value >= 800) {
    return "Moderate";
  }

  return "Stable";
}


function getConvergenceStatus(
  value: number
): "Low" | "Moderate" | "Strong" {

  const magnitude =
    Math.abs(value);

  if (magnitude >= 15) {
    return "Strong";
  }

  if (magnitude >= 5) {
    return "Moderate";
  }

  return "Low";
}


function getRiskStatusType(
  level: string
): "normal" | "warning" | "danger" {

  if (
    level === "Critical" ||
    level === "High"
  ) {
    return "danger";
  }

  if (
    level === "Moderate"
  ) {
    return "warning";
  }

  return "normal";
}


function Dashboard() {

  const [weatherData, setWeatherData] =
    useState<WeatherData | null>(null);
    
  const [opSummary, setOpSummary] = 
    useState<ApiOperationalSummary | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [selectedIndicator, setSelectedIndicator] =
    useState<
      | "iwv"
      | "cape"
      | "kinematics"
      | "flood"
      | null
    >(null);

  const [
    isRainfallDetailsOpen,
    setIsRainfallDetailsOpen,
  ] = useState(false);

  const [
    isCurrentWeatherOpen,
    setIsCurrentWeatherOpen,
  ] = useState(false);


  /* =========================================================
     LOAD WEATHER DATA
     ========================================================= */

  useEffect(() => {

    async function loadWeatherData() {

      try {

        setLoading(true);

        const data =
          await getBackendWeatherData(
            "Central Monitoring Zone"
          );

        setWeatherData(data);
        
        try {
            const summary = await fetchOperationalSummary();
            setOpSummary(summary);
        } catch (sumErr) {
            console.error("Failed to load operational summary", sumErr);
        }

        setError(null);

      } catch (err) {

        console.error(
          "Failed to load weather data:",
          err
        );

        setError(
          "Unable to load weather information."
        );

      } finally {

        setLoading(false);

      }

    }

    loadWeatherData();

  }, []);


  /* =========================================================
     LOADING STATE
     ========================================================= */

  if (loading) {

    return (

      <div className="dashboard-state">

        <div className="dashboard-state-card">

          <div className="loading-spinner"></div>

          <h2>
            Loading Weather Intelligence
          </h2>

          <p>
            Connecting to the RainGuard data service...
          </p>

        </div>

      </div>

    );

  }


  /* =========================================================
     ERROR STATE
     ========================================================= */

  if (error || !weatherData) {

    return (

      <div className="dashboard-state">

        <div className="dashboard-state-card error">

          <AlertTriangle size={28} />

          <h2>
            Weather Data Unavailable
          </h2>

          <p>
            {error ??
              "No weather information is available."}
          </p>

        </div>

      </div>

    );

  }


  /* =========================================================
     DATA SHORTCUTS
     ========================================================= */

  const current =
    weatherData.current;

  const atmospheric =
    weatherData.atmospheric;

  const floodRisk =
    weatherData.floodRisk;


  /* =========================================================
     DASHBOARD
     ========================================================= */

  return (

    <div className="dashboard-page">


      {/* =====================================================
          01 — INTRODUCTION
          ===================================================== */}

      <section className="dashboard-intro">

        <h2>
          Situation Overview
        </h2>

      </section>


      {/* =====================================================
          02 — CURRENT WEATHER
          ===================================================== */}

      <section
        className="current-weather-card current-weather-clickable"
        onClick={() =>
          setIsCurrentWeatherOpen(true)
        }
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            setIsCurrentWeatherOpen(true);

          }

        }}
      >


        {/* MAIN WEATHER */}

        <div className="weather-main">

          <div className="weather-location">

            <MapPin size={16} />

            <span>
              {weatherData.location}
            </span>

          </div>


          <div className="weather-condition">

            <CloudRain
              size={48}
              strokeWidth={1.6}
            />

            <div>

              <span className="weather-temperature">
                {current.temperature}°
              </span>

              <span className="weather-unit">
                C
              </span>

            </div>

          </div>


          <h3>
            {current.condition}
          </h3>


          <p>
            {floodRisk.level === "Critical"
              ? "Critical atmospheric and flood-risk conditions detected across the monitoring region."
              : floodRisk.level === "High"
              ? "Elevated atmospheric and flood-risk conditions detected across the monitoring region."
              : current.rainfall >= 5
              ? "Active precipitation detected across the monitoring region."
              : "Atmospheric conditions are currently being monitored across the region."}
          </p>

        </div>


        {/* WEATHER DETAILS */}

        <div className="weather-details">

          <div className="weather-detail">

            <Droplets size={19} />

            <div>

              <span>
                Humidity
              </span>

              <strong>
                {current.humidity}%
              </strong>

            </div>

          </div>


          <div className="weather-detail">

            <CloudRain size={19} />

            <div>

              <span>
                Rainfall
              </span>

              <strong>
                {current.rainfall} mm/hr
              </strong>

            </div>

          </div>


          <div className="weather-detail">

            <Wind size={19} />

            <div>

              <span>
                Wind Speed
              </span>

              <strong>
                {current.windSpeed} km/h
              </strong>

            </div>

          </div>


          <div className="weather-detail">

            <Gauge size={19} />

            <div>

              <span>
                Pressure
              </span>

              <strong>
                {current.pressure} hPa
              </strong>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          03 — LARGE VISUAL STORY
          ===================================================== */}

      <section className="dashboard-visual-break dashboard-visual-break-clean">

        <div className="visual-break-message visual-break-left">

          <span className="visual-break-line"></span>

          <h3>
            Safer Communities
            <br />
            Brighter Tomorrows
          </h3>

          <span className="visual-break-line"></span>

        </div>


        <div className="visual-break-message visual-break-right">

          <p>
            “From data to action for
            <br />
            a safer tomorrow.”
          </p>

          <span className="visual-break-line"></span>

        </div>

      </section>


      {/* =====================================================
          04 — ATMOSPHERIC INDICATORS
          ===================================================== */}

      <section className="dashboard-section dashboard-section-spacious">

        <div className="section-heading">

          <div>

            <h3 className="section-title atmospheric-indicators-title" style={{ color: "white" }}>
              Atmospheric Indicators
            </h3>

            <p className="section-subtitle">
              Key parameters used for severe-weather and
              flood-risk assessment.
            </p>

          </div>

        </div>


        <div className="metric-grid">

          <MetricCard
            label="Integrated Water Vapour"
            value={
              atmospheric.integratedWaterVapour.toString()
            }
            unit="kg/m²"
            status={getIwvStatus(
              atmospheric.integratedWaterVapour
            )}
            statusType={
              atmospheric.integratedWaterVapour >= 55
                ? "danger"
                : atmospheric.integratedWaterVapour >= 40
                ? "warning"
                : "normal"
            }
            icon={
              <Droplets size={20} />
            }
            iconType="sky"
            onClick={() =>
              setSelectedIndicator("iwv")
            }
          />


          <MetricCard
            label="CAPE"
            value={
              atmospheric.cape.toLocaleString()
            }
            unit="J/kg"
            status={getCapeStatus(
              atmospheric.cape
            )}
            statusType={
              atmospheric.cape >= 1500
                ? "danger"
                : atmospheric.cape >= 800
                ? "warning"
                : "normal"
            }
            icon={
              <Gauge size={20} />
            }
            iconType="orange"
            onClick={() =>
              setSelectedIndicator("cape")
            }
          />


          <MetricCard
            label="Wind Convergence"
            value={
              atmospheric.windConvergence.toString()
            }
            unit="/hr"
            status={getConvergenceStatus(
              atmospheric.windConvergence
            )}
            statusType={
              Math.abs(
                atmospheric.windConvergence
              ) >= 15
                ? "danger"
                : Math.abs(
                    atmospheric.windConvergence
                  ) >= 5
                ? "warning"
                : "normal"
            }
            icon={
              <Wind size={20} />
            }
            iconType="blue"
            onClick={() =>
              setSelectedIndicator("kinematics")
            }
          />


          <MetricCard
            label="Flood Risk"
            value={
              atmospheric.floodRisk.toString()
            }
            unit="%"
            status={`${floodRisk.level} Risk`}
            statusType={getRiskStatusType(
              floodRisk.level
            )}
            icon={
              <AlertTriangle size={20} />
            }
            iconType="red"
            onClick={() =>
              setSelectedIndicator("flood")
            }
          />

        </div>

      </section>


      {/* =====================================================
          05 — ATMOSPHERIC INTELLIGENCE
          ===================================================== */}

      <section className="dashboard-intelligence-spacing">

        <AtmosphericIntelligencePanel

          integratedWaterVapour={
            weatherData.atmospheric
              .integratedWaterVapour
          }

          cape={
            weatherData.atmospheric.cape
          }

          cin={
            weatherData.atmospheric.cin
          }

          windConvergence={
            weatherData.atmospheric
              .windConvergence
          }

          floodRisk={
            weatherData.atmospheric
              .floodRisk
          }

        />

      </section>


      {/* =====================================================
          06 — RAINFALL + FLOOD RISK
          ===================================================== */}

      <section className="dashboard-lower-grid dashboard-lower-grid-spacious">


        {/* RAINFALL */}

        <article
          className="dashboard-panel rainfall-panel-clickable"
          onClick={() =>
            setIsRainfallDetailsOpen(true)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {

            if (
              event.key === "Enter" ||
              event.key === " "
            ) {

              event.preventDefault();

              setIsRainfallDetailsOpen(true);

            }

          }}
        >

          <div className="panel-header">

            <div>

              <h3 className="section-title">
                Rainfall Activity
              </h3>

              <p className="section-subtitle">
                Recent precipitation intensity
              </p>

            </div>


            <span className="panel-value">
              {current.rainfall} mm/hr
            </span>

          </div>


          <RainfallChart
            data={
              weatherData.rainfallHistory
            }
          />

        </article>


        {/* FLOOD RISK */}

        <article
          className="dashboard-panel risk-summary risk-panel-clickable"
          onClick={() =>
            setSelectedIndicator("flood")
          }
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {

            if (
              event.key === "Enter" ||
              event.key === " "
            ) {

              event.preventDefault();

              setSelectedIndicator("flood");

            }

          }}
        >

          <div className="panel-header">

            <div>

              <h3 className="section-title">
                Flood Risk Status
              </h3>

              <p className="section-subtitle">
                Current regional assessment
              </p>

            </div>


            <AlertTriangle
              size={21}
              className="risk-icon"
            />

          </div>


          <div className="risk-score">

            <div className="risk-score-number">

              {floodRisk.score}

              <span>
                %
              </span>

            </div>


            <div>

              <strong>
                {opSummary ? `${opSummary.critical_cells} Critical, ${opSummary.high_risk_cells} High Risk Cells` : `${floodRisk.level} Risk`}
              </strong>

              <p>
                {opSummary ? `Dominant Hazard: ${opSummary.dominant_hazard} • Worsening Cells: ${opSummary.worsening_cells}` : floodRisk.description}
              </p>

            </div>

          </div>


          <div className="risk-progress">

            <div className="risk-progress-track">

              <div
                className="risk-progress-value"
                style={{
                  width:
                    `${opSummary ? Math.min(100, (opSummary.critical_cells + opSummary.high_risk_cells) * 2) : floodRisk.score}%`,
                }}
              ></div>

            </div>


            <div className="risk-progress-labels">

              <span>
                Low
              </span>

              <span>
                Moderate
              </span>

              <span>
                High
              </span>

              <span>
                Critical
              </span>

            </div>

          </div>

        </article>

      </section>


      {/* =====================================================
          MODALS
          ===================================================== */}

      <IndicatorDetailsModal

        isOpen={
          selectedIndicator !== null
        }

        onClose={() =>
          setSelectedIndicator(null)
        }

        type={
          selectedIndicator ?? "iwv"
        }

        value={

          selectedIndicator === "iwv"

            ? atmospheric
                .integratedWaterVapour
                .toString()

            : selectedIndicator === "cape"

            ? atmospheric
                .cape
                .toLocaleString()

            : selectedIndicator === "kinematics"

            ? atmospheric
                .windConvergence
                .toString()

            : atmospheric
                .floodRisk
                .toString()

        }

        unit={

          selectedIndicator === "iwv"

            ? "kg/m²"

            : selectedIndicator === "cape"

            ? "J/kg"

            : selectedIndicator === "kinematics"

            ? "/hr"

            : "%"

        }

        status={

          selectedIndicator === "iwv"

            ? "Elevated"

            : selectedIndicator === "cape"

            ? "Unstable"

            : selectedIndicator === "kinematics"

            ? "Moderate"

            : `${floodRisk.level} Risk`

        }

      />


      <RainfallDetailsModal

        isOpen={
          isRainfallDetailsOpen
        }

        onClose={() =>
          setIsRainfallDetailsOpen(false)
        }

        data={
          weatherData.rainfallHistory
        }

        currentRainfall={
          current.rainfall
        }

      />


      <CurrentWeatherModal

        isOpen={
          isCurrentWeatherOpen
        }

        onClose={() =>
          setIsCurrentWeatherOpen(false)
        }

        weather={
          current
        }

        location={
          weatherData.location
        }

      />

    </div>

  );

}


export default Dashboard;