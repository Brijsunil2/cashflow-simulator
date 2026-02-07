import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { TRANSACTION_KIND, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "../../logic/transactionConstants";

const TransactionForm = ({ onSubmit }) => {
  const [transaction, setTransaction] = useState({
    name: "",
    amount: "",
    kind: TRANSACTION_KIND.INCOME,
    category: "",
  });

  function handleChange(field, value) {
    setTransaction((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

    function handleKindChange(newKind) {
    setTransaction((prev) => ({
      ...prev,
      kind: newKind,
      category: '',
    }));
  }

   function handleSubmit(e) {
    e.preventDefault();

    if (
      !transaction.name ||
      !transaction.amount ||
      !transaction.category
    ) {
      return;
    }

    onSubmit({
      id: uuidv4(),
      name: transaction.name,
      amount: Number(transaction.amount),
      kind: transaction.kind,
      category: transaction.category,
      date: new Date().toISOString().split('T')[0],
    });

    setTransaction(initialTransaction);
  }

  const categories =
    transaction.kind === TRANSACTION_KIND.INCOME
      ? Object.values(INCOME_CATEGORIES)
      : Object.values(EXPENSE_CATEGORIES);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Transaction</h2>

      <input
        placeholder="Name"
        value={transaction.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        value={transaction.amount}
        onChange={(e) => handleChange('amount', e.target.value)}
      />

      <select
        value={transaction.kind}
        onChange={(e) => handleKindChange(e.target.value)}
      >
        <option value={TRANSACTION_KIND.INCOME}>Income</option>
        <option value={TRANSACTION_KIND.EXPENSE}>Expense</option>
      </select>

      <select
        value={transaction.category}
        onChange={(e) => handleChange('category', e.target.value)}
      >
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <button type="submit">Add</button>
    </form>
  );
};

export default TransactionForm;
