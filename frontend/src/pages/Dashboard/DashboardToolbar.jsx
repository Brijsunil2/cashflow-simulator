import React, { useRef, useState } from 'react';
import HoverCard from "../../components/HoverCard/HoverCard";
import DateRange from "../../components/DateRange/DateRange";

const DashboardToolbar = ({
    dateRange,
    setDateRange,
    onImport,
    onOpenExport,
    onOpenAddTransaction
}) => {
    const fileInputRef = useRef(null);
    const [rangeInput, setRangeInput] = useState("");

    const parseDateRange = (input) => {
        const parts = input.split(/\s+to\s+/i);
        if (parts.length === 2) {
            const from = new Date(parts[0].trim());
            const to = new Date(parts[1].trim());
            if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
                return { from, to };
            }
        }
        return null;
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setRangeInput(value);
        const parsed = parseDateRange(value);
        if (parsed) {
            setDateRange(parsed);
        }
    };

    const formattedRange = (range) => {
        if (!range?.from) return "";
        const fromStr = range.from.toISOString().split("T")[0];
        const toStr = range.to ? range.to.toISOString().split("T")[0] : fromStr;
        return `${fromStr} to ${toStr}`;
    };

    return (
        <div className="dashboard__subheader">
            <div className="dashboard__date-range-wrapper">
                <HoverCard
                    clickOnly={true}
                    trigger={
                        <div className="dashboard__date-range-input-wrapper">
                            <input
                                type="text"
                                className="dashboard__date-range-input"
                                placeholder="YYYY-MM-DD to YYYY-MM-DD"
                                value={rangeInput}
                                onChange={handleInputChange}
                            />
                            <button className="dashboard__date-range-btn">
                                <span className="calendar-icon">📅</span>
                            </button>
                        </div>
                    }
                >
                    <div className="dashboard__date-range-popup-content">
                        <DateRange
                            selectedRange={dateRange}
                            onChange={(newRange) => {
                                setDateRange(newRange);
                                if (newRange) {
                                    setRangeInput(formattedRange(newRange));
                                } else {
                                    setRangeInput("");
                                }
                            }}
                        />
                    </div>
                </HoverCard>
            </div>

            <div className="dashboard__actions">
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept=".json"
                    onChange={onImport}
                />
                <button
                    className="dashboard__btn dashboard__btn--secondary"
                    onClick={() => fileInputRef.current.click()}
                >
                    Import
                </button>
                <button
                    className="dashboard__btn dashboard__btn--secondary"
                    onClick={onOpenExport}
                >
                    Export
                </button>
                <button
                    className="dashboard__btn dashboard__btn--secondary"
                    onClick={() => window.print()}
                >
                    Print
                </button>

                <button
                    className="add-transaction-btn"
                    onClick={onOpenAddTransaction}
                >
                    Add Transaction
                </button>
            </div>
        </div>
    );
};

export default DashboardToolbar;
