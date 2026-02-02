import TransactionItem from "./TransactionItem";

const TransactionList = ({ transactions, onDelete }) => {
  return (
    <section>
      <h2>Transactions</h2>
      <ul>
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
