import "./Popup.scss";
import { IoMdClose } from "react-icons/io";

const Popup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-header">
          <h2>{title}</h2>
          <button className="popup-close" onClick={onClose}>
            <IoMdClose size={24} />
          </button>
        </div>
        <div className="popup-body">{children}</div>
      </div>
    </div>
  );
};

export default Popup;
