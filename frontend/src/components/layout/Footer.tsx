import { ArrowUp, CloudRain, Map, ShieldCheck } from "lucide-react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

function Footer({ onNavigate }: FooterProps) {
  const handleTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleNavigation = (page: string) => {
    onNavigate(page);
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  return (
    <footer className="site-footer">

      {/* ================= CTA ================= */}
      <section className="footer-cta">
        <div className="footer-cta-content">
          <div className="footer-cta-text">
            <span className="footer-eyebrow">
              DISASTER MANAGEMENT INTELLIGENCE
            </span>

            <h2>
              Stay Prepared.
              <br />
              Stay Informed.
            </h2>

            <p>
              RainGuard AI brings atmospheric intelligence, rainfall
              monitoring and flood-risk assessment together to support
              faster decisions and safer communities.
            </p>
          </div>

          <div className="footer-cta-actions">
            <button
              className="footer-primary-button"
              onClick={() => handleNavigation("Alerts")}
            >
              <ShieldCheck size={17} />
              <span>View Active Alerts</span>
              <span className="footer-button-arrow">↗</span>
            </button>

            <button
              className="footer-secondary-button"
              onClick={() => handleNavigation("Risk Map")}
            >
              <Map size={17} />
              <span>Open Risk Map</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= MAIN FOOTER ================= */}
      <section className="footer-main">
        <div className="footer-brand">
          <div className="footer-brand-icon">
            <CloudRain size={20} />
          </div>

          <div>
            <h3>RainGuard</h3>
            <span>AI</span>
          </div>

          <p>
            AI-powered atmospheric and flood intelligence
            <br />
            for resilient communities.
          </p>
        </div>

        <div className="footer-navigation">

          <div className="footer-column">
            <h4>Monitoring</h4>

            <button onClick={() => handleNavigation("Weather")}>
              Weather Monitoring
            </button>

            <button onClick={() => handleNavigation("Risk Map")}>
              Flood Risk Map
            </button>

            <button onClick={() => handleNavigation("Forecast")}>
              Forecast
            </button>

            <button onClick={() => handleNavigation("Alerts")}>
              Alerts
            </button>
          </div>

          <div className="footer-column">
            <h4>Intelligence</h4>

            <button onClick={() => handleNavigation("Analytics")}>
              Analytics
            </button>

            <button onClick={() => handleNavigation("Dashboard")}>
              Atmospheric Analysis
            </button>

            <button onClick={() => handleNavigation("Dashboard")}>
              Rainfall Intelligence
            </button>

            <button onClick={() => handleNavigation("Risk Map")}>
              Flood Assessment
            </button>
          </div>

          <div className="footer-column">
            <h4>System</h4>

            <button onClick={() => handleNavigation("Settings")}>
              Data Sources
            </button>

            <button onClick={() => handleNavigation("System Status")}>
              System Status
            </button>

            <button onClick={() => handleNavigation("Profile")}>
              About RainGuard
            </button>

            <button onClick={() => handleNavigation("Profile")}>
              Contact
            </button>
          </div>

        </div>
      </section>

      {/* ================= GOVERNMENT IDENTITY BAR ================= */}
      <section className="footer-bottom">
        <div className="footer-government-identity">
          <div className="footer-government-icon">
            <ShieldCheck size={17} />
          </div>

          <div>
            <strong>RAINGUARD AI</strong>
            <span>Disaster Management Intelligence System</span>
          </div>
        </div>

        <div className="footer-meta">
          <span>© 2026 RainGuard AI</span>
          <span>Government Technology Platform</span>

          <button
            className="back-to-top"
            onClick={handleTop}
          >
            Back to top
            <ArrowUp size={14} />
          </button>
        </div>
      </section>

    </footer>
  );
}

export default Footer;