import React, { useState } from 'react';
import PieChart from "../../components/PieChart/PieChart";

const ChartSection = ({ displayedSummary, chartData }) => {
    const [isChartExpanded, setIsChartExpanded] = useState(true);

    return (
        <div className="dashboard__chart-section">
            <div className="dashboard__chart-header">
                <div className="dashboard__chart-title-group">
                    <h3>Visual Summary</h3>
                    <button
                        className="dashboard__chart-toggle"
                        onClick={() => setIsChartExpanded(!isChartExpanded)}
                        aria-expanded={isChartExpanded}
                        title={isChartExpanded ? "Hide chart" : "Show chart"}
                    >
                        {isChartExpanded ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                <line x1="2" y1="2" x2="22" y2="22" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {isChartExpanded && (
                <div className="dashboard__chart-wrapper">
                    {displayedSummary.totalIncome === 0 && displayedSummary.totalExpenses === 0 ? (
                        <div className="dashboard__chart-empty">
                            <p>No transactions found for this period.</p>
                        </div>
                    ) : (
                        <PieChart data={chartData} innerRadiusRatio={0.7} />
                    )}
                </div>
            )}
        </div>
    );
};

export default ChartSection;
