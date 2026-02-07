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

const initialBudget = {
  month: "2026-01",
  startingBalance: 0,
  transactions: [],
};

const Dashboard = () => {
  const [budget, dispatch] = useReducer(budgetReducer, initialBudget);

  return (
    <div className="page">
      <div className="page-container dashboard">
        {/* Header */}
        <header className="dashboard__header">
          <h1>CashFlow Dashboard</h1>
          <p>Monthly income, expenses, and balance overview</p>
        </header>

        {/* Summary */}
        <section className="dashboard__summary">
          <SummaryCard
            netBalance={calculateBudgetBalance(budget)}
            totalIncome={getTotalIncome(budget)}
            totalExpenses={getTotalExpenses(budget)}
          />
        </section>

        {/* Main content */}
        <section className="dashboard__content">
          <div className="dashboard__transactions">
            <TransactionList
              transactions={budget.transactions}
              onDelete={(transactionId) =>
                dispatch({
                  type: "REMOVE_TRANSACTION",
                  payload: transactionId,
                })
              }
            />
          </div>

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
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
