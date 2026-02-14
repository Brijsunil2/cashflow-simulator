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
  const [transaction, setTransaction] = useState(INITIAL_TRANSACTION);

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
      <div className="form-field">
        <input
          placeholder=" "
          value={transaction.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required={true}
        />
        <label>
          Name <span>*</span>
        </label>
      </div>

      <div className="form-field">
        <input
          type="date"
          placeholder=" "
          value={transaction.date || today}
          onChange={(e) => handleChange("date", e.target.value)}
          required={true}
        />
        <label>
          Date <span>*</span>
        </label>
      </div>

      <div className="form-field amount-field">
        <span className="currency-symbol">$</span>
        <input
          type="number"
          name="amount"
          value={transaction.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          min={0}
          required ={true}
        />
        <label>
          Amount <span>*</span>
        </label>
      </div>

      <div className="form-field">
        <select
          value={transaction.type}
          onChange={(e) => handleTypeChange(e.target.value)}
          required={true}
        >
          <option value="" disabled hidden></option>
          <option value={TRANSACTION_TYPE.INCOME}>Income</option>
          <option value={TRANSACTION_TYPE.EXPENSE}>Expense</option>
        </select>
        <label>
          Type <span>*</span>
        </label>
      </div>

      <div className="form-field">
        <select
          value={transaction.category}
          onChange={(e) => handleChange("category", e.target.value)}
          required={true}
        >
          <option value="" disabled hidden></option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <label>
          Category <span>*</span>
        </label>
      </div>

      <div className="form-field">
        <textarea
          placeholder=" "
          value={transaction.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          required={false}
        />
        <label>Notes</label>
      </div>

      <button type="submit">Add Transaction</button>
    </form>
  );
};

export default TransactionForm;
