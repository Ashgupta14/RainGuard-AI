import {
  CloudRain,
  Droplets,
  Gauge,
  MapPin,
  Thermometer,
  Wind,
  X,
} from "lucide-react";

import type { CurrentWeather } from "../../types/weather";

interface CurrentWeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: CurrentWeather;
  location: string;
}

function CurrentWeatherModal({
  isOpen,
  onClose,
  weather,
  location,
}: CurrentWeatherModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="indicator-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="current-weather-modal"
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
                CURRENT CONDITIONS
              </span>

              <h3>
                Weather Observation
              </h3>
            </div>
          </div>

          <button
            type="button"
            className="indicator-modal-close"
            onClick={onClose}
            aria-label="Close weather details"
          >
            <X size={18} />
          </button>
        </div>

        {/* Location */}
        <div className="weather-modal-location">
          <MapPin size={16} />

          <span>
            {location}
          </span>
        </div>

        {/* Main Condition */}
        <div className="weather-modal-main">

          <div className="weather-modal-condition-icon">
            <CloudRain
              size={42}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <div className="weather-modal-temperature">
              {weather.temperature}
              <span>°C</span>
            </div>

            <strong>
              {weather.condition}
            </strong>

            <p>
              Current atmospheric observation
            </p>
          </div>

        </div>

        {/* Weather Metrics */}
        <div className="weather-modal-grid">

          <div className="weather-modal-metric">
            <div>
              <Droplets size={18} />
            </div>

            <span>
              Humidity
            </span>

            <strong>
              {weather.humidity}%
            </strong>
          </div>

          <div className="weather-modal-metric">
            <div>
              <CloudRain size={18} />
            </div>

            <span>
              Rainfall
            </span>

            <strong>
              {weather.rainfall} mm/hr
            </strong>
          </div>

          <div className="weather-modal-metric">
            <div>
              <Wind size={18} />
            </div>

            <span>
              Wind Speed
            </span>

            <strong>
              {weather.windSpeed} km/h
            </strong>
          </div>

          <div className="weather-modal-metric">
            <div>
              <Gauge size={18} />
            </div>

            <span>
              Pressure
            </span>

            <strong>
              {weather.pressure} hPa
            </strong>
          </div>

        </div>

        {/* Interpretation */}
        <div className="weather-modal-section">
          <div className="weather-modal-section-title">
            <Thermometer size={16} />

            <h4>
              Observation Summary
            </h4>
          </div>

          <p>
            Current conditions indicate{" "}
            <strong>
              {weather.condition.toLowerCase()}
            </strong>{" "}
            across the monitoring region, with
            rainfall intensity of{" "}
            <strong>
              {weather.rainfall} mm/hr
            </strong>
            .
          </p>
        </div>

        {/* Footer */}
        <div className="indicator-modal-footer">
          <CloudRain size={16} />

          <span>
            Live weather observations will be
            connected through the RainGuard data
            adapter.
          </span>
        </div>

      </div>
    </div>
  );
}

export default CurrentWeatherModal;