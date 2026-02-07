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
    <div className="dashboard-container">
      <h1>CashFlow Dashboard</h1>

      <SummaryCard
        netBalance={calculateBudgetBalance(budget)}
        totalIncome={getTotalIncome(budget)}
        totalExpenses={getTotalExpenses(budget)}
      />

      <TransactionForm
        onSubmit={(transaction) =>
          dispatch({ type: "ADD_TRANSACTION", payload: transaction })
        }
      />

      <TransactionList
        transactions={budget.transactions}
        onDelete={(transactionId) =>
          dispatch({ type: "REMOVE_TRANSACTION", payload: transactionId })
        }
      />
    </div>
  );
};

export default Dashboard;
