import { FaInfoCircle } from "react-icons/fa";
import "../styles/InfoTooltip.css";

interface InfoTooltipProps {
  message: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ message }) => {
  return (
    <div className="info-wrapper">
      <FaInfoCircle className="info-icon" />
      <div className="info-tooltip">
        {message}
      </div>
    </div>
  );
};

export default InfoTooltip;
