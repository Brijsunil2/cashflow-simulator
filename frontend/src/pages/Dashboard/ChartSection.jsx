import React, { useMemo, useState } from 'react';
import PieChart from "../../components/PieChart/PieChart";
import LineGraph from "../../components/LineGraph/LineGraph";

const ChartSection = ({ displayedSummary, chartData, displayedTransactions = [] }) => {
    const [isChartExpanded, setIsChartExpanded] = useState(true);

    const lineGraphData = useMemo(() => {
        if (!displayedTransactions || displayedTransactions.length === 0) {
            return [];
        }

        let cumulativeBalance = 0;
        let cumulativeIncome = 0;
        let cumulativeExpense = 0;

        const balancePoints = [];
        const incomePoints = [];
        const expensePoints = [];

        // Transactions are usually sorted newest first, reverse to process chronologically
        const sortedTransactions = [...displayedTransactions].reverse();

        // Calculate cumulative running totals per each point in time
        sortedTransactions.forEach(transaction => {
            if (transaction.type === 'income') {
                cumulativeBalance += transaction.amount;
                cumulativeIncome += transaction.amount;
            } else if (transaction.type === 'expense') {
                cumulativeBalance -= transaction.amount;
                cumulativeExpense += transaction.amount; // track as positive magnitude for the graph
            }

            const date = new Date(transaction.date);

            balancePoints.push({ x: date, y: cumulativeBalance });
            incomePoints.push({ x: date, y: cumulativeIncome });
            expensePoints.push({ x: date, y: cumulativeExpense });
        });

        return [
            {
                id: "Income",
                color: "#10b981",
                data: incomePoints
            },
            {
                id: "Expenses",
                color: "#ef4444",
                data: expensePoints
            },
            {
                id: "Net Balance",
                color: "#047857",
                data: balancePoints
            }
        ];
    }, [displayedTransactions]);

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
                <div
                    className="dashboard__chart-wrapper"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                        gap: '2rem',
                        aspectRatio: 'auto', /* Override Dashboard.scss aspect ratio to prevent horizontal blowout */
                        height: 'auto'
                    }}
                >
                    {displayedSummary.totalIncome === 0 && displayedSummary.totalExpenses === 0 ? (
                        <div className="dashboard__chart-empty" style={{ gridColumn: '1 / -1' }}>
                            <p>No transactions found for this period.</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <PieChart data={chartData} innerRadiusRatio={0.7} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {lineGraphData.length > 1 && lineGraphData[0].data.length > 1 ? (
                                    <LineGraph data={lineGraphData} />
                                ) : (
                                    <div className="dashboard__chart-empty">
                                        <p>Not enough data points for trend line.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChartSection;
