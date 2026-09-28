import {
  Activity,
  ArrowDown,
  ArrowUp,
  CloudRain,
  Gauge,
  X,
} from "lucide-react";

import type { RainfallDataPoint } from "../../types/weather";

interface RainfallDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: RainfallDataPoint[];
  currentRainfall: number;
}

function RainfallDetailsModal({
  isOpen,
  onClose,
  data,
  currentRainfall,
}: RainfallDetailsModalProps) {
  if (!isOpen) {
    return null;
  }

  const rainfallValues = data.map(
    (point) => point.rainfall
  );

  const peakRainfall =
    Math.max(...rainfallValues);

  const averageRainfall =
    rainfallValues.reduce(
      (sum, value) => sum + value,
      0
    ) / rainfallValues.length;

  const totalObservedRainfall =
    rainfallValues.reduce(
      (sum, value) => sum + value,
      0
    );

  const firstValue = rainfallValues[0] ?? 0;
  const lastValue =
    rainfallValues[rainfallValues.length - 1] ?? 0;

  const trendIncreasing =
    lastValue > firstValue;

  return (
    <div
      className="indicator-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="rainfall-details-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}
        <div className="indicator-modal-header">
          <div className="indicator-modal-title">
            <div className="indicator-modal-icon">
              <CloudRain size={22} />
            </div>

            <div>
              <span>
                PRECIPITATION ANALYSIS
              </span>

              <h3>
                Rainfall Activity
              </h3>
            </div>
          </div>

          <button
            type="button"
            className="indicator-modal-close"
            onClick={onClose}
            aria-label="Close rainfall details"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Rainfall */}
        <div className="rainfall-current-value">
          <div>
            <span>
              CURRENT INTENSITY
            </span>

            <strong>
              {currentRainfall}
              <small> mm/hr</small>
            </strong>
          </div>

          <div className="rainfall-trend">
            {trendIncreasing ? (
              <ArrowUp size={17} />
            ) : (
              <ArrowDown size={17} />
            )}

            <span>
              {trendIncreasing
                ? "Increasing"
                : "Decreasing"}
            </span>
          </div>
        </div>

        {/* Statistics */}
        <div className="rainfall-stat-grid">

          <div className="rainfall-stat">
            <Gauge size={18} />

            <span>
              Peak Intensity
            </span>

            <strong>
              {peakRainfall} mm/hr
            </strong>
          </div>

          <div className="rainfall-stat">
            <Activity size={18} />

            <span>
              Average Intensity
            </span>

            <strong>
              {averageRainfall.toFixed(1)}
              {" "}mm/hr
            </strong>
          </div>

          <div className="rainfall-stat">
            <CloudRain size={18} />

            <span>
              Total Observed
            </span>

            <strong>
              {totalObservedRainfall.toFixed(1)}
              {" "}mm
            </strong>
          </div>

        </div>

        {/* Recent Observations */}
        <div className="rainfall-observations">

          <h4>
            Recent Observations
          </h4>

          <div className="rainfall-observation-list">
            {data
              .slice(-5)
              .reverse()
              .map((point) => (
                <div
                  className="rainfall-observation"
                  key={point.time}
                >
                  <span>
                    {point.time}
                  </span>

                  <strong>
                    {point.rainfall}
                    {" "}mm/hr
                  </strong>
                </div>
              ))}
          </div>

        </div>

        {/* Footer */}
        <div className="indicator-modal-footer">
          <CloudRain size={16} />

          <span>
            Detailed rainfall forecasting and
            satellite/radar integration will be
            connected during the data integration
            phase.
          </span>
        </div>

      </div>
    </div>
  );
}

export default RainfallDetailsModal;