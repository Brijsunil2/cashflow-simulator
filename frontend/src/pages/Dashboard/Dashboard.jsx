import "./Dashboard.scss";
import { useReducer } from "react";
import { budgetReducer } from "../../logic/budgetReducer";
import {
  calculateBudgetBalance,
  getTotalIncome,
  getTotalExpenses,
} from "../../logic/budgetEngine";
import SummaryCard from "../../components/SummaryCard/SummaryCard";
import TransactionForm from "../../components/TransactionForm/TransactionForm";
import TransactionList from "../../components/TransactionList/TransactionList";

const initialState = {
  budgets: {
    "2026-01": {
      startingBalance: 0,
      transactions: [],
    },
  },
  currentMonth: "2026-01",
};

const Dashboard = () => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  return (
    <div className="page">
      <div className="page-container dashboard">
        <header className="dashboard__header">
          <h1>CashFlow Dashboard</h1>
          <p>Monthly income, expenses, and balance overview</p>
        </header>

        <section className="dashboard__summary">
          <SummaryCard
            netBalance={calculateBudgetBalance(initialState.budgets[initialState.currentMonth])}
            totalIncome={getTotalIncome(initialState.budgets[initialState.currentMonth])}
            totalExpenses={getTotalExpenses(initialState.budgets[initialState.currentMonth])}
          />
        </section>

        <section className="dashboard__content">
          <div className="dashboard__form">
            <TransactionForm
              onSubmit={(transaction) =>
                dispatch({
                  type: "ADD_TRANSACTION",
                  payload: transaction,
                })
              }
            />
          </div>

          <div className="dashboard__transactions">
            <TransactionList
              transactions={initialState.budgets[initialState.currentMonth].transactions}
              onDelete={(transactionId) =>
                dispatch({
                  type: "REMOVE_TRANSACTION",
                  payload: transactionId,
                })
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
