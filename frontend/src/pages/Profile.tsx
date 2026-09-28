import {
  CheckCircle2,
  ShieldCheck,
  User,
} from "lucide-react";

function Profile() {
  return (
    <div className="module-page">
      <div className="module-header">
        <div>
          <p className="dashboard-kicker">
            USER MANAGEMENT
          </p>

          <h2>Administrator Profile</h2>

          <p>
            View the current RainGuard AI operator profile
            and access information.
          </p>
        </div>

        <div className="module-status">
          <span className="status-dot"></span>
          Account Active
        </div>
      </div>

      <div className="profile-page-card">

        <div className="profile-page-avatar">
          A
        </div>

        <div className="profile-page-info">
          <h3>Administrator</h3>

          <p>
            System Operator
          </p>

          <span>
            RainGuard AI Disaster Management System
          </span>
        </div>

        <div className="profile-page-status">
          <CheckCircle2 size={17} />
          Active
        </div>

      </div>

      <div className="module-grid">

        <div className="module-card">
          <User size={26} />

          <h3>Role</h3>

          <p>
            System Administrator
          </p>
        </div>

        <div className="module-card">
          <ShieldCheck size={26} />

          <h3>Access Level</h3>

          <p>
            Full monitoring and system access
          </p>
        </div>

      </div>
    </div>
  );
}

export default Profile;