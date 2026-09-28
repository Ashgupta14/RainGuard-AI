import { useEffect, useState } from "react";

import {
  Activity,
  CloudRain,
  Droplets,
  Gauge,
  RefreshCw,
  Thermometer,
  Wind,
} from "lucide-react";

import { getWeatherData } from "../services/weatherService";

import type { WeatherData } from "../types/weather";

function Weather() {
  const [weatherData, setWeatherData] =
    useState<WeatherData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  async function loadWeatherData(
    isRefresh = false
  ) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data =
        await getWeatherData();

      setWeatherData(data);
    } catch (error) {
      console.error(
        "Failed to load weather data:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadWeatherData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-state">
        <div className="dashboard-state-card">
          <div className="loading-spinner"></div>

          <h2>
            Loading Weather Intelligence
          </h2>

          <p>
            Retrieving current atmospheric
            observations...
          </p>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="dashboard-state">
        <div className="dashboard-state-card error">
          <CloudRain size={28} />

          <h2>
            Weather Data Unavailable
          </h2>

          <p>
            The weather monitoring service could
            not provide data.
          </p>

          <button
            type="button"
            className="module-action"
            onClick={() =>
              loadWeatherData()
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const current =
    weatherData.current;

  const atmospheric =
    weatherData.atmospheric;

  const lastUpdated =
    new Date(
      weatherData.lastUpdated
    ).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    );

  return (
    <div className="module-page">

      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="module-header">

        <div>
          <p className="dashboard-kicker">
            WEATHER MONITORING
          </p>

          <h2>
            Weather Intelligence
          </h2>

          <p>
            Real-time atmospheric and weather
            observations for the monitoring region.
          </p>
        </div>

        <div className="weather-page-actions">

          <div className="module-status">
            <span className="status-dot"></span>
            Monitoring Active
          </div>

          <button
            type="button"
            className="weather-refresh-button"
            onClick={() =>
              loadWeatherData(true)
            }
            disabled={refreshing}
          >
            <RefreshCw
              size={15}
              className={
                refreshing
                  ? "refresh-spinning"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh Data"}
          </button>

        </div>

      </div>

      {/* ==================================================
          LOCATION / LAST UPDATED
          ================================================== */}

      <div className="weather-page-meta">

        <div>
          <span>
            Monitoring Location
          </span>

          <strong>
            {weatherData.location}
          </strong>
        </div>

        <div>
          <span>
            Last Updated
          </span>

          <strong>
            {lastUpdated}
          </strong>
        </div>

      </div>

      {/* ==================================================
          CURRENT CONDITION
          ================================================== */}

      <div className="weather-page-hero">

        <div className="weather-page-condition">

          <div className="weather-page-icon">
            <CloudRain
              size={42}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <span>
              CURRENT CONDITION
            </span>

            <h3>
              {current.condition}
            </h3>

            <p>
              Active precipitation detected
              across the monitoring region.
            </p>
          </div>

        </div>

        <div className="weather-page-temperature">
          <strong>
            {current.temperature}°
          </strong>

          <span>
            C
          </span>
        </div>

      </div>

      {/* ==================================================
          WEATHER METRICS
          ================================================== */}

      <div className="weather-metric-grid">

        {/* Temperature */}
        <div className="weather-page-card">

          <div className="weather-page-card-icon">
            <Thermometer size={19} />
          </div>

          <span>
            Temperature
          </span>

          <strong>
            {current.temperature}
            <small> °C</small>
          </strong>

        </div>

        {/* Humidity */}
        <div className="weather-page-card">

          <div className="weather-page-card-icon">
            <Droplets size={19} />
          </div>

          <span>
            Humidity
          </span>

          <strong>
            {current.humidity}
            <small> %</small>
          </strong>

        </div>

        {/* Rainfall */}
        <div className="weather-page-card">

          <div className="weather-page-card-icon">
            <CloudRain size={19} />
          </div>

          <span>
            Rainfall
          </span>

          <strong>
            {current.rainfall}
            <small> mm/hr</small>
          </strong>

        </div>

        {/* Wind */}
        <div className="weather-page-card">

          <div className="weather-page-card-icon">
            <Wind size={19} />
          </div>

          <span>
            Wind Speed
          </span>

          <strong>
            {current.windSpeed}
            <small> km/h</small>
          </strong>

        </div>

        {/* Pressure */}
        <div className="weather-page-card">

          <div className="weather-page-card-icon">
            <Gauge size={19} />
          </div>

          <span>
            Pressure
          </span>

          <strong>
            {current.pressure}
            <small> hPa</small>
          </strong>

        </div>

        {/* Atmospheric Risk */}
        <div className="weather-page-card">

          <div className="weather-page-card-icon">
            <Activity size={19} />
          </div>

          <span>
            Atmospheric Risk
          </span>

          <strong>
            {atmospheric.floodRisk}
            <small> %</small>
          </strong>

        </div>

      </div>

      {/* ==================================================
          MONITORING SUMMARY
          ================================================== */}

      <div className="weather-summary-card">

        <div className="weather-summary-header">

          <div>
            <h3>
              Monitoring Summary
            </h3>

            <p>
              Key atmospheric observations currently
              available to RainGuard AI.
            </p>
          </div>

          <Activity size={21} />

        </div>

        <div className="weather-summary-grid">

          <div>
            <span>
              Integrated Water Vapour
            </span>

            <strong>
              {atmospheric.integratedWaterVapour}
              {" "}kg/m²
            </strong>
          </div>

          <div>
            <span>
              CAPE
            </span>

            <strong>
              {atmospheric.cape}
              {" "}J/kg
            </strong>
          </div>

          <div>
            <span>
              Wind Convergence
            </span>

            <strong>
              {atmospheric.windConvergence}
              {" "}/hr
            </strong>
          </div>

          <div>
            <span>
              Flood Risk
            </span>

            <strong>
              {atmospheric.floodRisk}
              {" "}%
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Weather;