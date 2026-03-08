import "./Dashboard.scss";
import { useReducer, useState, useRef } from "react";
import { budgetReducer, BUDGET_ACTIONS } from "../../logic/budgetReducer";
import SummaryCard from "../../components/SummaryCard/SummaryCard";
import TransactionForm from "../../components/TransactionForm/TransactionForm";
import TransactionList from "../../components/TransactionList/TransactionList";
import {
  selectSummary,
  selectSortedTransactions,
  selectTransactionsByDateRange,
} from "../../logic/budgetSelector";
import Popup from "../../components/Popup/Popup";
import { testTransactions } from "../../test/testTransactions";
import DateRange from "../../components/DateRange/DateRange";
import HoverCard from "../../components/HoverCard/HoverCard";
import PieChart from "../../components/PieChart/PieChart";

const initialState = {
  userId: "user123",
  currency: "CAD",
  transactions:
    import.meta.env.VITE_APP_ENV === "development" ? testTransactions : [],
};

const Dashboard = () => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isExportPopupOpen, setIsExportPopupOpen] = useState(false);
  const [exportFileName, setExportFileName] = useState("cashflow_data");
  const [dateRange, setDateRange] = useState(null);
  const [isChartExpanded, setIsChartExpanded] = useState(true);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const fileName = `${exportFileName || "cashflow_data"}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", fileName);
    linkElement.click();
    setIsExportPopupOpen(false);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        dispatch({
          type: BUDGET_ACTIONS.IMPORT_DATA,
          payload: json,
        });
        // Reset file input so same file can be imported again if needed
        e.target.value = "";
      } catch (err) {
        console.error("Invalid JSON file", err);
        alert("Failed to import data: Invalid file format.");
      }
    };
  };

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

  const displayedTransactions =
    dateRange?.from && dateRange?.to
      ? selectTransactionsByDateRange(state, dateRange.from, dateRange.to)
      : selectSortedTransactions(state);

  const displayedSummary = displayedTransactions.reduce(
    (acc, tx) => {
      if (tx.type === "income") {
        acc.totalIncome += tx.amount;
      } else {
        acc.totalExpenses += tx.amount;
      }
      acc.netBalance = acc.totalIncome - acc.totalExpenses;
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0, netBalance: 0 }
  );

  const chartData = [
    { label: "Income", value: displayedSummary.totalIncome, color: "#10b981" },
    { label: "Expenses", value: displayedSummary.totalExpenses, color: "#ef4444" },
  ];

  return (
    <div className="page">
      <div className="page-container dashboard">
        <header className="dashboard__header">
          <div className="dashboard__header-content">
            <div className="dashboard__header-text">
              <span className="dashboard__header-greeting">Welcome back,</span>
              <h1>CashFlow</h1>
              <p className="dashboard__header-subtitle">Dashboard</p>
            </div>
          </div>
        </header>

        <section className="dashboard__summary">
          <SummaryCard
            netBalance={displayedSummary.netBalance}
            totalIncome={displayedSummary.totalIncome}
            totalExpenses={displayedSummary.totalExpenses}
          />
        </section>

        <section className="dashboard__content">
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
                onChange={handleImport}
              />
              <button
                className="dashboard__btn dashboard__btn--secondary"
                onClick={() => fileInputRef.current.click()}
              >
                Import
              </button>
              <button
                className="dashboard__btn dashboard__btn--secondary"
                onClick={() => setIsExportPopupOpen(true)}
              >
                Export
              </button>

              <button
                className="add-transaction-btn"
                onClick={() => setIsPopupOpen(true)}
              >
                Add Transaction
              </button>
            </div>
          </div>

          <Popup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            title="Add New Transaction"
          >
            <div className="dashboard__form">
              <TransactionForm
                onSubmit={(transaction) => {
                  setIsPopupOpen(false);
                  dispatch({
                    type: "ADD_TRANSACTION",
                    payload: transaction,
                  });
                }}
              />
            </div>
          </Popup>

          <Popup
            isOpen={isExportPopupOpen}
            onClose={() => setIsExportPopupOpen(false)}
            title="Export Data"
          >
            <div className="dashboard__export-form">
              <p className="dashboard__export-help">Enter a name for your backup file:</p>
              <div className="dashboard__export-input-group">
                <input
                  type="text"
                  className="dashboard__export-input"
                  value={exportFileName}
                  onChange={(e) => setExportFileName(e.target.value)}
                  placeholder="cashflow_data"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleExport()}
                />
                <span className="dashboard__export-extension">.json</span>
              </div>
              <div className="dashboard__export-actions">
                <button
                  className="dashboard__btn dashboard__btn--secondary"
                  onClick={() => setIsExportPopupOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="dashboard__btn add-transaction-btn"
                  onClick={handleExport}
                >
                  Download
                </button>
              </div>
            </div>
          </Popup>

          <div className="dashboard__content-body">
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

            <div className="dashboard__transactions">
              <TransactionList
                transactions={displayedTransactions}
                dateRange={dateRange}
                onDelete={(transactionId) =>
                  dispatch({
                    type: "REMOVE_TRANSACTION",
                    payload: transactionId,
                  })
                }
                onEdit={(editedTransaction) =>
                  dispatch({
                    type: "UPDATE_TRANSACTION",
                    payload: editedTransaction,
                  })
                }
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
