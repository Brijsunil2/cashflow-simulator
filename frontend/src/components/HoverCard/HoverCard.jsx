import { useState, useEffect, useRef } from "react";
import "./HoverCard.scss";

const HoverCard = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover)");
    setCanHover(mediaQuery.matches);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!canHover && cardRef.current && !cardRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [canHover]);

  return (
    <div
      className="hover-card"
      ref={cardRef}
      onMouseEnter={() => canHover && setIsOpen(true)}
      onMouseLeave={() => canHover && setIsOpen(false)}
      onClick={() => !canHover && setIsOpen((prev) => !prev)}
    >
      <div className="hover-card__trigger">{trigger}</div>

      <div className={`hover-card__content ${isOpen ? "open" : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default HoverCard;