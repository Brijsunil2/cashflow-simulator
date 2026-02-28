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

  const displayedTransactions =
    dateRange?.from && dateRange?.to
      ? selectTransactionsByDateRange(state, dateRange.from, dateRange.to)
      : selectSortedTransactions(state);

  return (
    <div className="page">
      <div className="page-container dashboard">
        <header className="dashboard__header">
          <h1>CashFlow Dashboard</h1>
          <p>Monthly income, expenses, and balance overview</p>
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
                trigger={<button className="dashboard__date-range-btn">Select Date Range</button>}
              >
                <div className="dashboard__date-range-popup-content">
                  <DateRange onChange={setDateRange} />
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
            {state.transactions.length > 0 && (
              <div className="dashboard_charts"></div>
            )}

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
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
