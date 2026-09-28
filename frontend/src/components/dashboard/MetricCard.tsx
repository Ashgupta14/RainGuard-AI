import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  status: string;
  statusType:
    | "normal"
    | "warning"
    | "danger";
  icon: ReactNode;
  iconType:
    | "sky"
    | "orange"
    | "blue"
    | "red";
  onClick?: () => void;
}

function MetricCard({
  label,
  value,
  unit,
  status,
  statusType,
  icon,
  iconType,
  onClick,
}: MetricCardProps) {
  return (
    <article
      className={`metric-card ${
        onClick
          ? "metric-card-clickable"
          : ""
      }`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (
          onClick &&
          (event.key === "Enter" ||
            event.key === " ")
        ) {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div
        className={`metric-icon ${iconType}`}
      >
        {icon}
      </div>

      <div className="metric-content">
        <span className="metric-label">
          {label}
        </span>

        <strong className="metric-value">
          {value}

          {unit && (
            <small>
              {" "}
              {unit}
            </small>
          )}
        </strong>

        <span
          className={`metric-status ${statusType}`}
        >
          {status}
        </span>
      </div>

      {onClick && (
        <span className="metric-card-hint">
          View details →
        </span>
      )}
    </article>
  );
}

export default MetricCard;