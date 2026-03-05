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

const initialState = {
  userId: "user123",
  currency: "CAD",
  transactions:
    import.meta.env.VITE_APP_ENV === "evelopment" ? testTransactions : [],
};

const Dashboard = () => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isExportPopupOpen, setIsExportPopupOpen] = useState(false);
  const [exportFileName, setExportFileName] = useState("cashflow_data");
  const [dateRange, setDateRange] = useState(null);
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
            netBalance={selectSummary(state).netBalance}
            totalIncome={selectSummary(state).totalIncome}
            totalExpenses={selectSummary(state).totalExpenses}
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
