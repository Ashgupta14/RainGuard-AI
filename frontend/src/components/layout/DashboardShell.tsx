import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Footer from "./Footer";

interface DashboardShellProps {
  children: ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  onMenuClick?: () => void;
}

function DashboardShell({
  children,
  activePage,
  onNavigate,
  onMenuClick,
}: DashboardShellProps) {
  return (
    <div className="dashboard-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
      />

      <main className="dashboard-main">
        <TopBar
          onMenuClick={onMenuClick}
          onNavigate={onNavigate}
        />

        <div className="dashboard-content">
          {children}
        </div>

        <Footer onNavigate={onNavigate} />
      </main>
    </div>
  );
}

export default DashboardShell;