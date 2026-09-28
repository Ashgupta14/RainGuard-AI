import { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CloudRain,
  RefreshCw,
  TrendingUp,
  Waves,
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

type AnalyticsRange = "7 Days" | "14 Days" | "30 Days";

interface AnalyticsPoint {
  day: string;
  rainfall: number;
  floodRisk: number;
}

const analyticsData: AnalyticsPoint[] = [
  { day: "01 Sep", rainfall: 18, floodRisk: 32 },
  { day: "02 Sep", rainfall: 24, floodRisk: 38 },
  { day: "03 Sep", rainfall: 16, floodRisk: 29 },
  { day: "04 Sep", rainfall: 31, floodRisk: 45 },
  { day: "05 Sep", rainfall: 28, floodRisk: 51 },
  { day: "06 Sep", rainfall: 36, floodRisk: 58 },
  { day: "07 Sep", rainfall: 42, floodRisk: 64 },
  { day: "08 Sep", rainfall: 29, floodRisk: 48 },
  { day: "09 Sep", rainfall: 45, floodRisk: 68 },
  { day: "10 Sep", rainfall: 52, floodRisk: 74 },
  { day: "11 Sep", rainfall: 48, floodRisk: 71 },
  { day: "12 Sep", rainfall: 39, floodRisk: 62 },
  { day: "13 Sep", rainfall: 34, floodRisk: 55 },
  { day: "14 Sep", rainfall: 27, floodRisk: 47 },
];

function Analytics() {
  const [range, setRange] = useState<AnalyticsRange>("14 Days");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const visibleData = useMemo(() => {
    if (range === "7 Days") {
      return analyticsData.slice(-7);
    }

    if (range === "30 Days") {
      return analyticsData;
    }

    return analyticsData;
  }, [range]);

  const averageRainfall =
    visibleData.reduce((sum, item) => sum + item.rainfall, 0) /
    visibleData.length;

  const peakRainfall = Math.max(
    ...visibleData.map((item) => item.rainfall)
  );

  const averageFloodRisk =
    visibleData.reduce((sum, item) => sum + item.floodRisk, 0) /
    visibleData.length;

  const highestRisk = Math.max(
    ...visibleData.map((item) => item.floodRisk)
  );

  function handleRefresh() {
    setIsRefreshing(true);

    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 900);
  }

  return (
    <section className="analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <span className="page-eyebrow">WEATHER & RISK ANALYTICS</span>

          <h1>Analytics Dashboard</h1>

          <p>
            Historical rainfall and flood-risk trends across the monitored
            area.
          </p>
        </div>

        <button
          type="button"
          className="analytics-refresh-button"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            size={16}
            className={isRefreshing ? "spin-icon" : ""}
          />

          {isRefreshing ? "Refreshing..." : "Refresh Analytics"}
        </button>
      </div>

      {/* Period selector */}
      <div className="analytics-toolbar">
        <div className="analytics-period">
          <CalendarDays size={15} />

          <span>Analysis Period</span>

          <div className="analytics-period-buttons">
            {(["7 Days", "14 Days", "30 Days"] as AnalyticsRange[]).map(
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

        <span className="analytics-data-status">
          Showing {visibleData.length} observations
        </span>
      </div>

      {/* Summary */}
      <div className="analytics-summary-grid">
        <article className="analytics-summary-card">
          <div className="analytics-summary-icon blue">
            <CloudRain size={20} />
          </div>

          <div>
            <span>Average Rainfall</span>
            <strong>
              {averageRainfall.toFixed(1)}
              <small> mm/hr</small>
            </strong>
            <em>Selected period</em>
          </div>
        </article>

        <article className="analytics-summary-card">
          <div className="analytics-summary-icon sky">
            <TrendingUp size={20} />
          </div>

          <div>
            <span>Peak Rainfall</span>
            <strong>
              {peakRainfall}
              <small> mm/hr</small>
            </strong>
            <em>Highest observed intensity</em>
          </div>
        </article>

        <article className="analytics-summary-card">
          <div className="analytics-summary-icon orange">
            <Waves size={20} />
          </div>

          <div>
            <span>Average Flood Risk</span>
            <strong>
              {averageFloodRisk.toFixed(0)}
              <small>%</small>
            </strong>
            <em>Risk index average</em>
          </div>
        </article>

        <article className="analytics-summary-card">
          <div className="analytics-summary-icon red">
            <BarChart3 size={20} />
          </div>

          <div>
            <span>Highest Risk</span>
            <strong>
              {highestRisk}
              <small>%</small>
            </strong>
            <em>Maximum observed risk</em>
          </div>
        </article>
      </div>

      {/* Rainfall chart */}
      <article className="analytics-panel">
        <div className="analytics-panel-header">
          <div>
            <h2>Rainfall Trend</h2>

            <p>
              Observed rainfall intensity over the selected analysis
              period.
            </p>
          </div>

          <span className="analytics-chart-label">
            mm/hr
          </span>
        </div>

        <div className="analytics-chart">
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
                  id="analyticsRainGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#6faed6"
                    stopOpacity={0.58}
                  />

                  <stop
                    offset="100%"
                    stopColor="#6faed6"
                    stopOpacity={0.04}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#d9dee7"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                tick={{
                  fontSize: 10,
                  fill: "#7b8796",
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
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
                formatter={(value) => [
                  `${value} mm/hr`,
                  "Rainfall",
                ]}
              />

              <Area
                type="monotone"
                dataKey="rainfall"
                stroke="#10367D"
                strokeWidth={2.5}
                fill="url(#analyticsRainGradient)"
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      {/* Flood risk chart */}
      <article className="analytics-panel">
        <div className="analytics-panel-header">
          <div>
            <h2>Flood Risk Trend</h2>

            <p>
              Historical flood-risk index calculated from monitored
              conditions.
            </p>
          </div>

          <span className="risk-index-label">
            Risk Index
          </span>
        </div>

        <div className="risk-trend-container">
          {visibleData.map((item) => (
            <div className="risk-trend-column" key={item.day}>
              <div className="risk-bar-wrapper">
                <div
                  className={`risk-bar ${
                    item.floodRisk >= 70
                      ? "critical"
                      : item.floodRisk >= 60
                      ? "high"
                      : item.floodRisk >= 30
                      ? "moderate"
                      : "low"
                  }`}
                  style={{
                    height: `${item.floodRisk}%`,
                  }}
                  title={`${item.floodRisk}% risk`}
                />
              </div>

              <strong>{item.floodRisk}%</strong>

              <span>{item.day}</span>
            </div>
          ))}
        </div>
      </article>

      {/* Observations */}
      <div className="analytics-observations-grid">
        <article className="analytics-observation-card">
          <div className="observation-icon">
            <TrendingUp size={18} />
          </div>

          <div>
            <span>Rainfall Observation</span>

            <strong>
              Rainfall intensity shows an elevated pattern during the
              selected period.
            </strong>

            <p>
              Peak rainfall reached {peakRainfall} mm/hr in the
              current dataset.
            </p>
          </div>
        </article>

        <article className="analytics-observation-card">
          <div className="observation-icon warning">
            <Waves size={18} />
          </div>

          <div>
            <span>Flood-Risk Observation</span>

            <strong>
              Flood risk increased alongside higher rainfall intensity.
            </strong>

            <p>
              Maximum observed flood-risk index reached {highestRisk}%.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Analytics;