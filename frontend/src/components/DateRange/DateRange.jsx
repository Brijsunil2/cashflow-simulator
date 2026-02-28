import "./DateRange.scss";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useState } from "react";

const DateRangePicker = ({ onChange }) => {
  const [range, setRange] = useState();

  const handleSelect = (selectedRange, selectedDay) => {
    let newRange = selectedRange;

    // Check if the user clicked an already selected day boundary and toggle it off
    if (range && selectedDay) {
      const isFrom = range.from && selectedDay.getTime() === range.from.getTime();
      const isTo = range.to && selectedDay.getTime() === range.to.getTime();

      if (isFrom && range.to) {
        // Toggle 'from' off, keep 'to' (which becomes the new 'from')
        newRange = { from: range.to, to: undefined };
      } else if (isTo && range.from) {
        // Toggle 'to' off, keep 'from'
        newRange = { from: range.from, to: undefined };
      } else if (isFrom && !range.to) {
        // Toggle 'from' off when there's no 'to'
        newRange = undefined;
      }
    }

    setRange(newRange);

    if (newRange?.from && newRange?.to) {
      onChange({
        from: newRange.from,
        to: newRange.to,
      });
    } else {
      // If we unselected everything or have incomplete range, optionally trigger onChange with null or similar if the parent needs to know.
      // Currently, it seems we only trigger onChange when we have both dates.
    }
  };

  return (
    <div className="custom-date-range-container">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default DateRangePicker;
