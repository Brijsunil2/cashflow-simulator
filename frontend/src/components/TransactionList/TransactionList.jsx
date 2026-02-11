import "./TransactionList.scss";
import TransactionItem from "./TransactionItem";

const TransactionList = ({ transactions, onDelete }) => {
  return (
    <section className="transaction-list-section">
      {transactions.length === 0 ? (
        <p className="transaction-list-empty">No transactions yet.</p>
      ) : null}
      <ul className="transaction-list">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  );
};

export default TransactionList;
