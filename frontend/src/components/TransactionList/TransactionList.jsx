import "./TransactionList.scss";
import TransactionItem from "./TransactionItem";

const TransactionList = ({ transactions, onDelete }) => {
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
        {transactions.map((transaction, index) => {
          const previous = transactions[index - 1];
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
    </section>
  );
};

export default TransactionList;
