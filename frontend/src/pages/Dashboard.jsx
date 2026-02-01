import { useReducer } from "react";
import { budgetReducer } from "../logic/budgetReducer";


const initialBudget = {
  month: '2026-01',
  startingBalance: 0,
  transactions: [],
};

const Dashboard = () => {
  const [budgets, dispatch] = useReducer(budgetReducer, initialBudget);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {/* Summary and transaction components would go here */}
      

      {/* Example button to add a transaction */}

      {/* Transaction list would go here */}
    </div>
  )
}

export default Dashboard