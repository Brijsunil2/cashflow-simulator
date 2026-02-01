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

      {/* Example button to remove a transaction */}

      {/* Example button to update a transaction */}
    </div>
  )
}

export default Dashboard