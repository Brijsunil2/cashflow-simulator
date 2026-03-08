import "./Dashboard.scss";
import { useReducer, useState } from "react";
import { budgetReducer, BUDGET_ACTIONS } from "../../logic/budgetReducer";
import SummaryCard from "../../components/SummaryCard/SummaryCard";
import TransactionForm from "../../components/TransactionForm/TransactionForm";
import TransactionList from "../../components/TransactionList/TransactionList";
import {
  selectSortedTransactions,
  selectTransactionsByDateRange,
} from "../../logic/budgetSelector";
import Popup from "../../components/Popup/Popup";
import { testTransactions } from "../../test/testTransactions";

import DashboardHeader from "./DashboardHeader";
import DashboardToolbar from "./DashboardToolbar";
import ExportDataPopup from "./ExportDataPopup";
import ChartSection from "./ChartSection";

const initialState = {
  userId: "user123",
  currency: "CAD",
  transactions:
    import.meta.env.VITE_APP_ENV != "production" ? testTransactions : [],
};

const Dashboard = () => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isExportPopupOpen, setIsExportPopupOpen] = useState(false);
  const [exportFileName, setExportFileName] = useState("cashflow_data");
  const [dateRange, setDateRange] = useState(null);

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
        e.target.value = "";
      } catch (err) {
        console.error("Invalid JSON file", err);
        alert("Failed to import data: Invalid file format.");
      }
    };
  };

  const displayedTransactions =
    dateRange?.from && dateRange?.to
      ? selectTransactionsByDateRange(state, dateRange.from, dateRange.to)
      : selectSortedTransactions(state);

  const displayedSummary = displayedTransactions.reduce(
    (acc, tx) => {
      if (tx.type === "income") {
        acc.totalIncome += tx.amount;
      } else {
        acc.totalExpenses += tx.amount;
      }
      acc.netBalance = acc.totalIncome - acc.totalExpenses;
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0, netBalance: 0 }
  );

  const chartData = [
    { label: "Income", value: displayedSummary.totalIncome, color: "#10b981" },
    { label: "Expenses", value: displayedSummary.totalExpenses, color: "#ef4444" },
  ];

  return (
    <div className="page">
      <div className="page-container dashboard">
        <DashboardHeader />

        <section className="dashboard__summary">
          <SummaryCard
            netBalance={displayedSummary.netBalance}
            totalIncome={displayedSummary.totalIncome}
            totalExpenses={displayedSummary.totalExpenses}
          />
        </section>

        <section className="dashboard__content">
          <DashboardToolbar
            dateRange={dateRange}
            setDateRange={setDateRange}
            onImport={handleImport}
            onOpenExport={() => setIsExportPopupOpen(true)}
            onOpenAddTransaction={() => setIsPopupOpen(true)}
          />

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

          <ExportDataPopup
            isOpen={isExportPopupOpen}
            onClose={() => setIsExportPopupOpen(false)}
            exportFileName={exportFileName}
            setExportFileName={setExportFileName}
            onExport={handleExport}
          />

          <div className="dashboard__content-body">
            <ChartSection
              displayedSummary={displayedSummary}
              chartData={chartData}
            />

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
