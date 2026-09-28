import {
  AlertTriangle,
  Droplets,
  Gauge,
  Wind,
  X,
  Zap,
} from "lucide-react";

interface IndicatorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type:
    | "iwv"
    | "cape"
    | "kinematics"
    | "flood";
  value: string;
  unit?: string;
  status: string;
}

interface IndicatorInformation {
  title: string;
  description: string;
  interpretation: string;
  icon: React.ReactNode;
}

const indicatorInformation: Record<
  IndicatorDetailsModalProps["type"],
  IndicatorInformation
> = {
  iwv: {
    title: "Integrated Water Vapour",
    description:
      "Integrated Water Vapour represents the total amount of water vapour contained in the atmospheric column above the monitoring region.",
    interpretation:
      "Higher values indicate greater atmospheric moisture availability, which can support heavier precipitation when other conditions are favourable.",
    icon: <Droplets size={22} />,
  },

  cape: {
    title: "CAPE",
    description:
      "Convective Available Potential Energy indicates the amount of atmospheric energy available for convection and thunderstorm development.",
    interpretation:
      "Higher CAPE generally indicates a more unstable atmosphere with greater potential for strong convective activity.",
    icon: <Zap size={22} />,
  },

  kinematics: {
    title: "Wind Convergence",
    description:
      "Wind convergence describes the accumulation of horizontal air flow in a region.",
    interpretation:
      "Stronger convergence can support upward motion and may contribute to the development or intensification of precipitation systems.",
    icon: <Wind size={22} />,
  },

  flood: {
    title: "Flood Risk",
    description:
      "The flood-risk score represents the current estimated level of localized flood threat based on monitored environmental indicators.",
    interpretation:
      "Higher scores indicate increasingly elevated flood-risk conditions and may require closer monitoring.",
    icon: <AlertTriangle size={22} />,
  },
};

function IndicatorDetailsModal({
  isOpen,
  onClose,
  type,
  value,
  unit,
  status,
}: IndicatorDetailsModalProps) {
  if (!isOpen) {
    return null;
  }

  const information =
    indicatorInformation[type];

  return (
    <div
      className="indicator-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="indicator-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="indicator-modal-header">
          <div className="indicator-modal-title">
            <div className="indicator-modal-icon">
              {information.icon}
            </div>

            <div>
              <span>
                ATMOSPHERIC INDICATOR
              </span>

              <h3>
                {information.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            className="indicator-modal-close"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="indicator-modal-value">
          <strong>{value}</strong>

          {unit && (
            <span>{unit}</span>
          )}

          <small>{status}</small>
        </div>

        <div className="indicator-modal-section">
          <h4>
            What does this measure?
          </h4>

          <p>
            {information.description}
          </p>
        </div>

        <div className="indicator-modal-section">
          <h4>
            Interpretation
          </h4>

          <p>
            {information.interpretation}
          </p>
        </div>

        <div className="indicator-modal-footer">
          <Gauge size={16} />

          <span>
            Detailed calculation and live
            data integration will be added
            in Phase 1.
          </span>
        </div>
      </div>
    </div>
  );
}

export default IndicatorDetailsModal;