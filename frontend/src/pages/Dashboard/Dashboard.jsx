import "./Dashboard.scss";
import { useReducer, useState } from "react";
import { budgetReducer } from "../../logic/budgetReducer";
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
    import.meta.env.VITE_APP_ENV === "development" ? testTransactions : [],
};

const Dashboard = () => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dateRange, setDateRange] = useState(null);

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

            <button
              className="add-transaction-btn"
              onClick={() => setIsPopupOpen(true)}
            >
              Add Transaction
            </button>
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
