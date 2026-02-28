import { useState, useEffect, useRef } from "react";
import "./HoverCard.scss";

const HoverCard = ({ trigger, children, clickOnly = false, align = "left", minWidth = "320px" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover)");
    setCanHover(mediaQuery.matches);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if ((clickOnly || !canHover) && cardRef.current && !cardRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [canHover, clickOnly]);

  return (
    <div
      className="hover-card"
      ref={cardRef}
      onMouseEnter={() => !clickOnly && canHover && setIsOpen(true)}
      onMouseLeave={() => !clickOnly && canHover && setIsOpen(false)}
    >
      <div
        className="hover-card__trigger"
        onClick={() => (clickOnly || !canHover) && setIsOpen((prev) => !prev)}
      >
        {trigger}
      </div>

      <div
        className={`hover-card__content hover-card__content--${align} ${isOpen ? "open" : ""}`}
        style={{ minWidth }}
      >
        {children}
      </div>
    </div>
  );
};

export default HoverCard;