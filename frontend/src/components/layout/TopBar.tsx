import { useEffect, useState, useRef } from "react";

type ActiveDropdown = "location" | "date" | "notifications" | "profile" | null;

import {
  AlertTriangle,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  MapPin,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";

interface TopBarProps {
  onMenuClick?: () => void;
  onNavigate: (page: string) => void;
}

const monitoringAreas = [
  "Chennai, Tamil Nadu",
  "Adyar, Chennai",
  "Velachery, Chennai",
  "Anna Nagar, Chennai",
  "T. Nagar, Chennai",
  "Tambaram, Chennai",
];

function TopBar({
  onMenuClick,
  onNavigate,
}: TopBarProps) {
  const [selectedArea, setSelectedArea] = useState(
    "Chennai, Tamil Nadu"
  );

  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const [currentTime, setCurrentTime] =
    useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate =
    currentTime.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formattedTime =
    currentTime.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).toUpperCase();

  function closeAllMenus() {
    setActiveDropdown(null);
  }

  return (
    <header className="topbar">

      {/* ==================================================
          MOBILE MENU
          ================================================== */}

      <button
        type="button"
        className="topbar-icon-button mobile-menu-button"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      {/* ==================================================
          DASHBOARD HEADING
          ================================================== */}

      <div className="topbar-heading">
        <div className="topbar-title-row">
          <ShieldCheck
            size={18}
            className="topbar-shield"
          />

          <h1>
            Flood Intelligence Dashboard
          </h1>
        </div>

        <p>
          Real-time atmospheric monitoring and flood-risk
          intelligence
        </p>
      </div>

      <div className="topbar-actions" ref={dropdownRef}>

        {/* ==================================================
            MONITORING AREA
            ================================================== */}

        <div className="location-wrapper">

          <button
            type="button"
            className="location-selector"
            onClick={() => setActiveDropdown(activeDropdown === "location" ? null : "location")}
          >
            <MapPin size={17} />

            <span>
              <small>
                Monitoring Area
              </small>

              <strong>
                {selectedArea}
              </strong>
            </span>

            <ChevronDown
              size={15}
              className={
                activeDropdown === "location" ? "chevron-open" : ""
              }
            />
          </button>

          {activeDropdown === "location" && (
            <div className="location-dropdown">

              <div className="dropdown-heading">
                Select Monitoring Area
              </div>

              {monitoringAreas.map(
                (area) => (
                  <button
                    key={area}
                    type="button"
                    className={`location-option ${
                      selectedArea === area
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedArea(area);
                      setActiveDropdown(null);
                    }}
                  >
                    <span>
                      {area}
                    </span>

                    {selectedArea === area && (
                      <Check size={15} />
                    )}
                  </button>
                )
              )}

            </div>
          )}

        </div>

        {/* ==================================================
            SYSTEM DATE
            ================================================== */}

        <div className="date-wrapper">

          <button
            type="button"
            className="topbar-date"
            onClick={() => setActiveDropdown(activeDropdown === "date" ? null : "date")}
          >
            <CalendarDays size={17} />

            <span>
              <small>
                Date
              </small>

              <strong>
                Today
              </strong>
            </span>

            <ChevronDown
              size={14}
              className={
                activeDropdown === "date" ? "chevron-open" : ""
              }
            />
          </button>

          {activeDropdown === "date" && (
            <div className="date-dropdown">

              <div className="date-dropdown-header">
                <CalendarDays size={18} />

                <div>
                  <strong>
                    Date
                  </strong>

                  <span>
                    RainGuard AI
                  </span>
                </div>
              </div>

              <div className="date-current">

                <span>
                  Today
                </span>

                <strong>
                  {formattedTime}
                </strong>

              </div>

              <div className="date-info-row">
                <Clock3 size={15} />

                <div>
                  <small>
                    Monitoring Period
                  </small>

                  <strong>
                    Live / Current
                  </strong>
                </div>
              </div>

              <div className="date-info-row">
                <ShieldCheck size={15} />

                <div>
                  <small>
                    System Status
                  </small>

                  <strong>
                    Synchronized
                  </strong>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ==================================================
            NOTIFICATIONS
            ================================================== */}

        <div className="notification-wrapper">

          <button
            type="button"
            className="topbar-icon-button notification-button"
            aria-label="Notifications"
            onClick={() => setActiveDropdown(activeDropdown === "notifications" ? null : "notifications")}
          >
            <Bell size={19} />

            <span className="notification-dot"></span>
          </button>

          {activeDropdown === "notifications" && (
            <div className="notification-panel">

              <div className="notification-header">

                <div>
                  <strong>
                    Notifications
                  </strong>

                  <span>
                    2 active alerts
                  </span>
                </div>

                <button
                  type="button"
                  className="notification-close"
                  onClick={() =>
                    setActiveDropdown(null)
                  }
                  aria-label="Close notifications"
                >
                  <X size={16} />
                </button>

              </div>

              <div className="notification-item warning">

                <div className="notification-item-icon">
                  <AlertTriangle size={17} />
                </div>

                <div>
                  <strong>
                    Heavy rainfall detected
                  </strong>

                  <p>
                    Current rainfall intensity:
                    <b> 24 mm/hr</b>
                  </p>

                  <span>
                    Just now
                  </span>
                </div>

              </div>

              <div className="notification-item danger">

                <div className="notification-item-icon">
                  <AlertTriangle size={17} />
                </div>

                <div>
                  <strong>
                    Flood risk elevated
                  </strong>

                  <p>
                    Current regional risk:
                    <b> High</b>
                  </p>

                  <span>
                    5 minutes ago
                  </span>
                </div>

              </div>

              <div className="notification-item success">

                <div className="notification-item-icon">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <strong>
                    Monitoring system active
                  </strong>

                  <p>
                    Atmospheric data monitoring is
                    operating normally.
                  </p>

                  <span>
                    10 minutes ago
                  </span>
                </div>

              </div>

              <div className="notification-footer">
                <button
                  type="button"
                  onClick={() =>
                    setActiveDropdown(null)
                  }
                >
                  Close Notifications
                </button>
              </div>

            </div>
          )}

        </div>

        {/* ==================================================
            ADMIN PROFILE
            ================================================== */}

        <div className="profile-wrapper">

          <button
            type="button"
            className="user-profile"
            onClick={() => setActiveDropdown(activeDropdown === "profile" ? null : "profile")}
          >
            <div className="user-avatar">
              A
            </div>

            <span>
              <small>
                Operator
              </small>

              <strong>
                Admin
              </strong>
            </span>

            <ChevronDown
              size={15}
              className={
                activeDropdown === "profile" ? "chevron-open" : ""
              }
            />
          </button>

          {activeDropdown === "profile" && (
            <div className="profile-dropdown">

              <div className="profile-summary">

                <div className="profile-large-avatar">
                  A
                </div>

                <div>
                  <strong>
                    Administrator
                  </strong>

                  <span>
                    System Operator
                  </span>
                </div>

              </div>

              <div className="profile-divider"></div>

              <button
                type="button"
                className="profile-option"
                onClick={() => {
                  setActiveDropdown(null);
                  onNavigate("Profile");
                }}
              >
                Profile
              </button>

              <button
                type="button"
                className="profile-option"
                onClick={() => {
                  setActiveDropdown(null);
                  onNavigate("System Status");
                }}
              >
                System Status
              </button>

              <button
                type="button"
                className="profile-option danger-option"
                onClick={() => {
                  const confirmed =
                    window.confirm(
                      "Are you sure you want to sign out?"
                    );

                  if (confirmed) {
                    setActiveDropdown(null);

                    window.alert(
                      "Sign-out functionality will be connected when authentication is implemented."
                    );
                  }
                }}
              >
                Sign Out
              </button>

            </div>
          )}

        </div>

      </div>
    </header>
  );
}

export default TopBar;