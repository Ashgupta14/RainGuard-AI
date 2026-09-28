import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RainfallDataPoint } from "../../types/weather";

interface RainfallChartProps {
  data: RainfallDataPoint[];
}

function RainfallChart({
  data,
}: RainfallChartProps) {
  return (
    <div className="rainfall-chart">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 8,
            left: 0,
            bottom: 0,
          }}
        >

          <defs>

            <linearGradient
              id="rainfallGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#6faed6"
                stopOpacity={0.55}
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
            dataKey="time"
            tick={{
              fontSize: 9,
              fill: "#7b8796",
            }}
            axisLine={false}
            tickLine={false}
          />


          <YAxis
            tick={{
              fontSize: 9,
              fill: "#7b8796",
            }}
            axisLine={false}
            tickLine={false}
            unit=" mm"
          />


          <Tooltip
            contentStyle={{
              border: "1px solid #d9dee7",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.96)",
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
            stroke="#10367d"
            strokeWidth={2.5}
            fill="url(#rainfallGradient)"
            activeDot={{
              r: 5,
            }}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}

export default RainfallChart;