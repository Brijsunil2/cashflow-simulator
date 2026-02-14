import "./TransactionForm.scss";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  TRANSACTION_TYPE,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  INITIAL_TRANSACTION,
} from "../../logic/transactionConstants";

const TransactionForm = ({ onSubmit }) => {
  const [transaction, setTransaction] = useState({
    name: "",
    amount: "",
    type: TRANSACTION_TYPE.INCOME,
    category: "",
  });

  function handleChange(field, value) {
    setTransaction((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleTypeChange(newType) {
    setTransaction((prev) => ({
      ...prev,
      type: newType,
      category: "",
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !transaction.name ||
      !transaction.type ||
      !transaction.date ||
      !transaction.amount ||
      !transaction.category
    ) {
      return;
    }

    onSubmit({
      id: "txn" + uuidv4(),
      date: transaction.date,
      name: transaction.name,
      amount: Number(transaction.amount),
      category: transaction.category,
      type: transaction.type,
      notes: transaction.notes || "",
    });

    setTransaction(INITIAL_TRANSACTION);
  }

  const categories =
    transaction.type === TRANSACTION_TYPE.INCOME
      ? Object.values(INCOME_CATEGORIES)
      : Object.values(EXPENSE_CATEGORIES);

  const today = new Date().toISOString().split("T")[0];

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={transaction.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <input
        type="date"
        value={transaction.date || today}
        onChange={(e) => handleChange("date", e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        value={transaction.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
      />

      <select
        value={transaction.type}
        onChange={(e) => handleTypeChange(e.target.value)}
      >
        <option value={TRANSACTION_TYPE.INCOME}>Income</option>
        <option value={TRANSACTION_TYPE.EXPENSE}>Expense</option>
      </select>

      <select
        value={transaction.category}
        onChange={(e) => handleChange("category", e.target.value)}
      >
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Notes (optional)"
        value={transaction.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
      />

      <button type="submit">Add Transaction</button>
    </form>
  );
};

export default TransactionForm;
