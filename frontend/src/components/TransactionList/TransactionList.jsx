import "./TransactionList.scss";
import TransactionItem from "./TransactionItem";
import { TRANSACTION_TYPE } from "../../logic/transactionConstants";
import Pagination from "../Pagination/Pagination";
import { usePagination } from "../../logic/usePagination";

const ITEMS_PER_PAGE = 5;

const TransactionList = ({ transactions, onDelete, onEdit, dateRange }) => {
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    paginatedItems,
  } = usePagination(transactions, ITEMS_PER_PAGE);

  const totalIncome = transactions
    .filter((t) => t.type === TRANSACTION_TYPE.INCOME)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === TRANSACTION_TYPE.EXPENSE)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpenses;

  const filterText =
    dateRange?.from && dateRange?.to
      ? `Showing: ${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
      : "Showing all";

  return (
    <section className="transaction-list-section">
      <div className="transaction-list__header">
        <div className="transaction-list__header-top">
          <h2 className="transaction-list__title">Transactions</h2>
          <span className="transaction-list__filter-status">
            {filterText}
          </span>
        </div>

        <div className="transaction-list__summary">
          <div className="summary-card income">
            <span className="summary-card__label">Total Income</span>
            <span className="summary-card__value">${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="summary-card expense">
            <span className="summary-card__label">Total Expenses</span>
            <span className="summary-card__value">-${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className={`summary-card balance ${netBalance >= 0 ? 'positive' : 'negative'}`}>
            <span className="summary-card__label">Net Balance</span>
            <span className="summary-card__value">
              {netBalance < 0 ? "-" : ""}${Math.abs(netBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="transaction-list-empty">
          <p>No transactions yet in this period.</p>
        </div>
      ) : (
        <>
          <ul className="transaction-list transaction-list--screen">
            {paginatedItems.map((transaction, index) => {
              const previous = paginatedItems[index - 1];
              const showDateHeader =
                index === 0 || previous?.date !== transaction.date;

              return (
                <li key={transaction.id} className="transaction-group">
                  {showDateHeader && (
                    <h3 className="transaction-date">
                      {transaction.date}
                    </h3>
                  )}

                  <TransactionItem
                    transaction={transaction}
                    onDelete={onDelete}
                    onEdit={onEdit}
                  />
                </li>
              );
            })}
          </ul>

          <div className="transaction-list-pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          <ul className="transaction-list transaction-list--print">
            {transactions.map((transaction, index) => {
              const previous = transactions[index - 1];
              const showDateHeader =
                index === 0 || previous?.date !== transaction.date;

              return (
                <li key={transaction.id} className="transaction-group">
                  {showDateHeader && (
                    <h3 className="transaction-date">
                      {transaction.date}
                    </h3>
                  )}

                  <TransactionItem
                    transaction={transaction}
                    onDelete={onDelete}
                    onEdit={onEdit}
                  />
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
};

export default TransactionList;
