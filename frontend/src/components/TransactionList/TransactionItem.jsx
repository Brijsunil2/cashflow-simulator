const TransactionItem = ({ transaction, onDelete }) => {
  return (
    <li
      className={`transaction-item ${transaction.kind.toLowerCase() == "income" ? "transaction-item--income" : "transaction-item--expense"}`}
    >
      <span>{transaction.date}</span>
      <span>{transaction.name}</span>
      <span>{transaction.category}</span>
      <span>${transaction.amount}</span>

      <button onClick={() => onDelete(transaction.id)}>Delete</button>
    </li>
  );
};

export default TransactionItem;
