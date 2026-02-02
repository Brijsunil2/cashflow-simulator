const TransactionItem = ({ transaction, onDelete }) => {
  return (
    <li>
        <span>{transaction.date}</span>
      <span> | {transaction.name}</span>
      <span> | {transaction.category}</span>
      <span> | {transaction.kind}</span>
      <span> | ${transaction.amount}</span>

      <button onClick={() => onDelete(transaction.id)}>Delete</button>
    </li>
  );
};

export default TransactionItem;
