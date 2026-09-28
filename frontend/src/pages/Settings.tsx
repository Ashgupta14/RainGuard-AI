import { useState } from "react";
import {
  getDataSource,
  setDataSource,
} from "../services/weatherService";

import {
  Bell,
  Check,
  Database,
  Settings as SettingsIcon,
  X,
} from "lucide-react";

type SettingsPanel =
  | "system"
  | "alerts"
  | "data"
  | null;

function Settings() {
  const [activePanel, setActivePanel] =
    useState<SettingsPanel>(null);

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(true);

  const [liveDataEnabled, setLiveDataEnabled] = useState(
    getDataSource() === "live"
  );

  const [autoRefresh, setAutoRefresh] =
    useState(true);

  function closePanel() {
    setActivePanel(null);
  }

  return (
    <div className="module-page">

      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="module-header">
        <div>
          <p className="dashboard-kicker">
            SYSTEM CONFIGURATION
          </p>

          <h2>
            Settings
          </h2>

          <p>
            Configure RainGuard AI monitoring and
            system preferences.
          </p>
        </div>

        <div className="module-status">
          <span className="status-dot"></span>
          System Ready
        </div>
      </div>

      {/* ==================================================
          SETTINGS CARDS
          ================================================== */}

      <div className="module-grid">

        {/* System Settings */}
        <div className="module-card">

          <SettingsIcon size={26} />

          <h3>
            System Settings
          </h3>

          <p>
            Configure general RainGuard AI
            application behaviour.
          </p>

          <button
            type="button"
            className="module-action"
            onClick={() =>
              setActivePanel("system")
            }
          >
            Configure
          </button>

        </div>

        {/* Alert Settings */}
        <div className="module-card">

          <Bell size={26} />

          <h3>
            Alert Settings
          </h3>

          <p>
            Configure flood and weather alert
            preferences.
          </p>

          <button
            type="button"
            className="module-action"
            onClick={() =>
              setActivePanel("alerts")
            }
          >
            Configure
          </button>

        </div>

        {/* Data Sources */}
        <div className="module-card">

          <Database size={26} />

          <h3>
            Data Sources
          </h3>

          <p>
            Configure demo and live weather
            data sources.
          </p>

          <button
            type="button"
            className="module-action"
            onClick={() =>
              setActivePanel("data")
            }
          >
            Configure
          </button>

        </div>

      </div>

      {/* ==================================================
          SYSTEM SETTINGS PANEL
          ================================================== */}

      {activePanel === "system" && (
        <div
          className="settings-modal-backdrop"
          onClick={closePanel}
        >
          <div
            className="settings-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="settings-modal-header">

              <div>
                <span>
                  SYSTEM CONFIGURATION
                </span>

                <h3>
                  System Settings
                </h3>
              </div>

              <button
                type="button"
                className="settings-close"
                onClick={closePanel}
                aria-label="Close settings"
              >
                <X size={18} />
              </button>

            </div>

            <div className="settings-option">

              <div>
                <strong>
                  Automatic Data Refresh
                </strong>

                <span>
                  Automatically refresh monitoring
                  information.
                </span>
              </div>

              <button
                type="button"
                className={`settings-toggle ${
                  autoRefresh
                    ? "enabled"
                    : ""
                }`}
                onClick={() =>
                  setAutoRefresh(
                    !autoRefresh
                  )
                }
              >
                <span></span>
              </button>

            </div>

            <div className="settings-info">
              <Check size={16} />

              <span>
                Current refresh mode:{" "}
                <strong>
                  {autoRefresh
                    ? "Automatic"
                    : "Manual"}
                </strong>
              </span>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================
          ALERT SETTINGS PANEL
          ================================================== */}

      {activePanel === "alerts" && (
        <div
          className="settings-modal-backdrop"
          onClick={closePanel}
        >
          <div
            className="settings-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="settings-modal-header">

              <div>
                <span>
                  EARLY WARNING SYSTEM
                </span>

                <h3>
                  Alert Settings
                </h3>
              </div>

              <button
                type="button"
                className="settings-close"
                onClick={closePanel}
                aria-label="Close alert settings"
              >
                <X size={18} />
              </button>

            </div>

            <div className="settings-option">

              <div>
                <strong>
                  Notifications
                </strong>

                <span>
                  Receive RainGuard system alerts.
                </span>
              </div>

              <button
                type="button"
                className={`settings-toggle ${
                  notificationsEnabled
                    ? "enabled"
                    : ""
                }`}
                onClick={() =>
                  setNotificationsEnabled(
                    !notificationsEnabled
                  )
                }
              >
                <span></span>
              </button>

            </div>

            <div className="settings-threshold">

              <label>
                Flood Risk Alert Threshold
              </label>

              <select defaultValue="60">
                <option value="30">
                  30% — Moderate
                </option>

                <option value="60">
                  60% — High
                </option>

                <option value="80">
                  80% — Critical
                </option>
              </select>

            </div>

            <div className="settings-info">
              <Check size={16} />

              <span>
                Alert notifications are{" "}
                <strong>
                  {notificationsEnabled
                    ? "enabled"
                    : "disabled"}
                </strong>
                .
              </span>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================
          DATA SOURCE PANEL
          ================================================== */}

      {activePanel === "data" && (
        <div
          className="settings-modal-backdrop"
          onClick={closePanel}
        >
          <div
            className="settings-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="settings-modal-header">

              <div>
                <span>
                  DATA MANAGEMENT
                </span>

                <h3>
                  Data Sources
                </h3>
              </div>

              <button
                type="button"
                className="settings-close"
                onClick={closePanel}
                aria-label="Close data settings"
              >
                <X size={18} />
              </button>

            </div>

            <div className="data-source-option active">

              <div>
                <strong>
                  Demo Data
                </strong>

                <span>
                  Local sample weather dataset
                </span>
              </div>

              <Check size={17} />

            </div>

            <div className="data-source-option">

              <div>
                <strong>
                  Live API
                </strong>

                <span>
                  RainGuard backend weather service
                </span>
              </div>

              <button
                type="button"
                className={`settings-toggle ${
                  liveDataEnabled
                    ? "enabled"
                    : ""
                }`}
                onClick={() => {
                  const nextValue = !liveDataEnabled;
                  setLiveDataEnabled(nextValue);
                  setDataSource(nextValue ? "live" : "demo");
                }}
              >
                <span></span>
              </button>

            </div>

            <div className="settings-info">
              <Database size={16} />

              <span>
                Active source:{" "}
                <strong>
                  {liveDataEnabled
                    ? "Live API"
                    : "Demo Data"}
                </strong>
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Settings;