import { useState, useEffect } from "react";

import DashboardShell from "./components/layout/DashboardShell";

import Dashboard from "./pages/Dashboard";
import Weather from "./pages/Weather";
import RiskMap from "./pages/RiskMap";
import Forecast from "./pages/Forecast";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import SystemStatus from "./pages/SystemStatus";

function App() {
  const [activePage, setActivePage] =
    useState("Dashboard");

  // Automatically scroll to the top when navigating to a new page
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [activePage]);

  function renderPage() {
    switch (activePage) {
      case "Weather":
        return <Weather />;

      case "Risk Map":
        return <RiskMap />;

      case "Forecast":
        return <Forecast />;

      case "Alerts":
        return <Alerts />;

      case "Analytics":
        return <Analytics />;

      case "Settings":
        return <Settings />;

      case "Dashboard":
      default:
        return <Dashboard />;
        
      case "Profile":
        return <Profile />;

      case "System Status":
        return <SystemStatus />;
    }
  }

  return (
    <div className="app">
      <DashboardShell
        activePage={activePage}
        onNavigate={setActivePage}
      >
        {renderPage()}
      </DashboardShell>
    </div>
  );
}

export default App;