import { useMemo, useState } from "react";
import {
  CloudRain,
  Droplets,
  RefreshCw,
  Clock3,
  Waves,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ForecastRange = "6 Hours" | "12 Hours" | "24 Hours";

interface ForecastPoint {
  time: string;
  rainfall: number;
  temperature: number;
}

const forecastData: ForecastPoint[] = [
  { time: "15:00", rainfall: 28, temperature: 27 },
  { time: "16:00", rainfall: 31, temperature: 26 },
  { time: "17:00", rainfall: 35, temperature: 25 },
  { time: "18:00", rainfall: 42, temperature: 24 },
  { time: "19:00", rainfall: 48, temperature: 24 },
  { time: "20:00", rainfall: 44, temperature: 23 },
  { time: "21:00", rainfall: 38, temperature: 23 },
  { time: "22:00", rainfall: 32, temperature: 22 },
  { time: "23:00", rainfall: 27, temperature: 22 },
  { time: "00:00", rainfall: 21, temperature: 21 },
  { time: "01:00", rainfall: 17, temperature: 21 },
  { time: "02:00", rainfall: 13, temperature: 20 },
];

const forecastCards = [
  {
    time: "15:00",
    condition: "Heavy Rain",
    temperature: 27,
    rainfall: 28,
    humidity: 84,
  },
  {
    time: "17:00",
    condition: "Heavy Rain",
    temperature: 25,
    rainfall: 35,
    humidity: 87,
  },
  {
    time: "19:00",
    condition: "Very Heavy Rain",
    temperature: 24,
    rainfall: 48,
    humidity: 91,
  },
  {
    time: "21:00",
    condition: "Heavy Rain",
    temperature: 23,
    rainfall: 38,
    humidity: 89,
  },
  {
    time: "23:00",
    condition: "Moderate Rain",
    temperature: 22,
    rainfall: 27,
    humidity: 84,
  },
  {
    time: "01:00",
    condition: "Light Rain",
    temperature: 21,
    rainfall: 17,
    humidity: 79,
  },
];

function Forecast() {
  const [range, setRange] = useState<ForecastRange>("12 Hours");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFloodDetails, setShowFloodDetails] = useState(false);

  const visibleData = useMemo(() => {
    if (range === "6 Hours") {
      return forecastData.slice(0, 6);
    }

    if (range === "24 Hours") {
      return forecastData;
    }

    return forecastData.slice(0, 9);
  }, [range]);

  const peakRainfall = Math.max(
    ...visibleData.map((item) => item.rainfall)
  );

  function handleRefresh() {
    setIsRefreshing(true);

    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 900);
  }

  return (
    <section className="forecast-page">
      {/* Header */}
      <div className="forecast-header">
        <div>
          <span className="page-eyebrow">PREDICTIVE WEATHER INTELLIGENCE</span>

          <h1>Rainfall Forecast</h1>

          <p>
            Short-term rainfall prediction and flood-risk outlook for the
            Central Monitoring Zone.
          </p>
        </div>

        <button
          type="button"
          className="forecast-refresh-button"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            size={16}
            className={isRefreshing ? "spin-icon" : ""}
          />

          {isRefreshing ? "Refreshing..." : "Refresh Forecast"}
        </button>
      </div>

      {/* Forecast summary */}
      <div className="forecast-summary-grid">
        <article className="forecast-summary-card">
          <div className="forecast-summary-icon blue">
            <CloudRain size={20} />
          </div>

          <div>
            <span>Peak Rainfall</span>
            <strong>
              {peakRainfall} <small>mm/hr</small>
            </strong>
            <em>Expected during forecast period</em>
          </div>
        </article>

        <article className="forecast-summary-card">
          <div className="forecast-summary-icon sky">
            <Droplets size={20} />
          </div>

          <div>
            <span>Atmospheric Moisture</span>
            <strong>
              42.3 <small>kg/m²</small>
            </strong>
            <em>High moisture availability</em>
          </div>
        </article>

        <article className="forecast-summary-card">
          <div className="forecast-summary-icon orange">
            <TrendingUp size={20} />
          </div>

          <div>
            <span>Rainfall Trend</span>
            <strong>Increasing</strong>
            <em>Peak expected around 19:00</em>
          </div>
        </article>

        <article className="forecast-summary-card">
          <div className="forecast-summary-icon red">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span>Flood Outlook</span>
            <strong>High</strong>
            <em>Enhanced monitoring recommended</em>
          </div>
        </article>
      </div>

      {/* Chart panel */}
      <article className="forecast-panel">
        <div className="forecast-panel-header">
          <div>
            <h2>Rainfall Intensity Forecast</h2>
            <p>Predicted rainfall intensity over the selected period.</p>
          </div>

          <div className="forecast-range-selector">
            {(["6 Hours", "12 Hours", "24 Hours"] as ForecastRange[]).map(
              (item) => (
                <button
                  type="button"
                  key={item}
                  className={range === item ? "active" : ""}
                  onClick={() => setRange(item)}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>

        <div className="forecast-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={visibleData}
              margin={{
                top: 10,
                right: 15,
                left: 0,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient
                  id="forecastRainGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#6faed6"
                    stopOpacity={0.6}
                  />

                  <stop
                    offset="100%"
                    stopColor="#6faed6"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#d9dee7"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tick={{
                  fontSize: 10,
                  fill: "#7b8796",
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                unit=" mm/hr"
                tick={{
                  fontSize: 10,
                  fill: "#7b8796",
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  border: "1px solid #d9dee7",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.97)",
                  fontSize: "11px",
                }}
                formatter={(value) => [`${value} mm/hr`, "Rainfall"]}
              />

              <Area
                type="monotone"
                dataKey="rainfall"
                stroke="#10367D"
                strokeWidth={2.5}
                fill="url(#forecastRainGradient)"
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="forecast-chart-note">
          <Clock3 size={15} />
          Forecast generated from current atmospheric conditions.
        </div>
      </article>

      {/* Forecast cards */}
      <article className="forecast-panel">
        <div className="forecast-panel-header">
          <div>
            <h2>Hourly Outlook</h2>
            <p>Expected conditions across the monitoring period.</p>
          </div>
        </div>

        <div className="forecast-cards-grid">
          {forecastCards.map((item) => (
            <div className="forecast-hour-card" key={item.time}>
              <span className="forecast-hour-time">{item.time}</span>

              <CloudRain
                size={27}
                className="forecast-hour-icon"
              />

              <strong>{item.temperature}°C</strong>

              <span className="forecast-condition">
                {item.condition}
              </span>

              <div className="forecast-hour-details">
                <span>
                  <Droplets size={13} />
                  {item.rainfall} mm/hr
                </span>

                <span>
                  Humidity {item.humidity}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* Time to Flood */}
      <article className="time-to-flood-panel">
        <div className="time-to-flood-content">
          <div className="time-to-flood-icon">
            <Waves size={25} />
          </div>

          <div>
            <span className="page-eyebrow">EARLY WARNING INDICATOR</span>

            <h2>Time-to-Flood Estimate</h2>

            <p>
              Current rainfall and atmospheric conditions indicate an
              elevated possibility of localized flooding if rainfall
              intensity persists.
            </p>
          </div>
        </div>

        <div className="flood-estimate">
          <span>Estimated Window</span>

          <strong>2–4 Hours</strong>

          <small>if current conditions persist</small>

          <button
            type="button"
            onClick={() => setShowFloodDetails((value) => !value)}
          >
            {showFloodDetails ? "Hide Details" : "View Assessment"}
          </button>
        </div>
      </article>

      {showFloodDetails && (
        <article className="flood-assessment-box">
          <div>
            <strong>Assessment Summary</strong>

            <p>
              Forecast rainfall is expected to remain elevated during the
              next several hours. Combined with high atmospheric moisture
              and current flood-risk conditions, localized low-lying areas
              should remain under observation.
            </p>
          </div>

          <div className="assessment-indicators">
            <span>Rainfall: High</span>
            <span>Moisture: High</span>
            <span>Flood Risk: High</span>
          </div>
        </article>
      )}
    </section>
  );
}

export default Forecast;