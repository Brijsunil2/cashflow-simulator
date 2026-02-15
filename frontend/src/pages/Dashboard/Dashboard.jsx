import "./Dashboard.scss";
import { useReducer } from "react";
import { budgetReducer } from "../../logic/budgetReducer";
import SummaryCard from "../../components/SummaryCard/SummaryCard";
import TransactionForm from "../../components/TransactionForm/TransactionForm";
import TransactionList from "../../components/TransactionList/TransactionList";
import { selectSummary } from "../../logic/budgetSelector";
import Popup from "../../components/Popup/Popup";

const initialState = {
  userId: "user123",
  currency: "CAD",
  transactions: [],
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
            netBalance={selectSummary(state).netBalance}
            totalIncome={selectSummary(state).totalIncome}
            totalExpenses={selectSummary(state).totalExpenses}
          />
        </section>

        <section className="dashboard__content">
          <div className="dashboard__subheader">
            <button className="" onClick={console.log("Add Transaction")}>
              + Add Transaction
            </button>
          </div>

          <Popup
            isOpen={true}
            onClose={() => console.log("Close Popup")}
            title="Add New Transaction"
          >
            test
          </Popup>

          {/* <div className="dashboard__form">
            <TransactionForm
              onSubmit={(transaction) =>
                dispatch({
                  type: "ADD_TRANSACTION",
                  payload: transaction,
                })
              }
            />
          </div> */}
          <div className="dashboard__content-body">
            <div className="dashboard_charts">
              <div className="dashboard__charts--line-graph">Line Graph</div>

              <div className="dashboard__charts--pie-chart">Pie Chart</div>
            </div>

            <div className="dashboard__transactions">
              <TransactionList
                transactions={state.transactions}
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
