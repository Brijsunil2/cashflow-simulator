import "./TransactionList.scss";
import TransactionItem from "./TransactionItem";
import Pagination from "../Pagination/Pagination";
import { usePagination } from "../../logic/usePagination";

const ITEMS_PER_PAGE = 8;

const TransactionList = ({ transactions, onDelete, onEdit, dateRange }) => {
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    paginatedItems,
  } = usePagination(transactions, ITEMS_PER_PAGE);

  const filterText =
    dateRange?.from && dateRange?.to
      ? `Showing: ${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
      : "Showing all";

  return (
    <section className="transaction-list-section">
      <div className="transaction-list__header">
        <span className="transaction-list__filter-status">
          {filterText}
        </span>
      </div>

      {transactions.length === 0 ? (
        <p className="transaction-list-empty">
          No transactions yet.
        </p>
      ) : (
        <>
          <ul className="transaction-list">
            {paginatedItems.map((transaction, index) => {
              const previous = paginatedItems[index - 1];
              const showDateHeader =
                index === 0 || previous.date !== transaction.date;

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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </section>
  );
};

export default TransactionList;
