import {
  AlertTriangle,
  BarChart3,
  CloudRain,
  CloudSun,
  LayoutDashboard,
  Map,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavigationItem {
  label: string;
  icon: React.ElementType;
}

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Weather",
    icon: CloudSun,
  },
  {
    label: "Risk Map",
    icon: Map,
  },
  {
    label: "Forecast",
    icon: CloudRain,
  },
  {
    label: "Alerts",
    icon: AlertTriangle,
  },
  {
    label: "Analytics",
    icon: BarChart3,
  },
];

function Sidebar({
  activePage,
  onNavigate,
  isOpen = false,
  onClose,
}: SidebarProps) {

  function handleNavigation(page: string) {
    onNavigate(page);

    if (onClose) {
      onClose();
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`dashboard-sidebar ${
          isOpen
            ? "sidebar-mobile-open"
            : ""
        }`}
      >

        {/* ==================================================
            BRAND
            ================================================== */}

        <div className="brand-mark">

          <div className="brand-icon">
            <ShieldCheck
              size={21}
              strokeWidth={2.2}
            />
          </div>

          <div className="brand-text">
            <span className="brand-name">
              RainGuard
            </span>

            <span className="brand-subtitle">
              AI
            </span>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            className="sidebar-close-button"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>

        </div>

        {/* ==================================================
            NAVIGATION
            ================================================== */}

        <nav
          className="sidebar-navigation"
          aria-label="RainGuard main navigation"
        >
          {navigationItems.map(
            (item) => {
              const Icon = item.icon;

              const isActive =
                activePage === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  className={`sidebar-item ${
                    isActive
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleNavigation(
                      item.label
                    )
                  }
                >
                  <span className="sidebar-icon">
                    <Icon
                      size={17}
                      strokeWidth={2}
                    />
                  </span>

                  <span>
                    {item.label}
                  </span>
                </button>
              );
            }
          )}
        </nav>

        {/* ==================================================
            BOTTOM
            ================================================== */}

        <div className="sidebar-bottom">

          <button
            type="button"
            className={`sidebar-item ${
              activePage === "Settings"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleNavigation(
                "Settings"
              )
            }
          >
            <span className="sidebar-icon">
              <Settings
                size={17}
                strokeWidth={2}
              />
            </span>

            <span>
              Settings
            </span>
          </button>

          <div className="government-label">
            <span>
              DISASTER MANAGEMENT
            </span>

            <strong>
              RAINGUARD AI
            </strong>
          </div>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;