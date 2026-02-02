import { useReducer } from "react";
import { budgetReducer } from "../logic/budgetReducer";
import {
  calculateBudgetBalance,
  getTotalIncome,
  getTotalExpenses,
} from "../logic/budgetEngine";
import SummaryCard from "../components/SummaryCard";
import TransactionForm from "../components/TransactionForm";

const initialBudget = {
  month: "2026-01",
  startingBalance: 0,
  transactions: [],
};

const Dashboard = () => {
  const [budget, dispatch] = useReducer(budgetReducer, initialBudget);

  return (
    <div className="dashboard-container">
      <h1>CashFlow Dashboard</h1>

      {/* Summary and transaction components would go here */}
      <SummaryCard
        netBalance={calculateBudgetBalance(budget)}
        totalIncome={getTotalIncome(budget)}
        totalExpenses={getTotalExpenses(budget)}
      />

      {/* Example button to add a transaction */}
      <TransactionForm
        onSubmit={(transaction) =>
          dispatch({ type: "ADD_TRANSACTION", payload: transaction })
        }
      />

      {/* Transaction list would go here */}
    </div>
  );
};

export default Dashboard;
