import "./TransactionList.scss";
import TransactionItem from "./TransactionItem";
import Pagination from "../Pagination/Pagination";
import { usePagination } from "../../logic/usePagination";

const ITEMS_PER_PAGE = 8;

const TransactionList = ({ transactions, onDelete }) => {
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    paginatedItems,
  } = usePagination(transactions, ITEMS_PER_PAGE);

  if (transactions.length === 0) {
    return (
      <section className="transaction-list-section">
        <p className="transaction-list-empty">
          No transactions yet.
        </p>
      </section>
    );
  }

  return (
    <section className="transaction-list-section">
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
    </section>
  );
};

export default TransactionList;
