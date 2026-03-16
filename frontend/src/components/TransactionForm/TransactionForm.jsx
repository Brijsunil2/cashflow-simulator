import "./TransactionForm.scss";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  TRANSACTION_TYPE,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  INITIAL_TRANSACTION,
} from "../../logic/transactionConstants";
import { formatLabel } from "../../util/stringManipulation";

const TransactionForm = ({ onSubmit, initialData }) => {
  const [transaction, setTransaction] = useState(initialData || INITIAL_TRANSACTION);

  useEffect(() => {
    if (initialData) {
      setTransaction(initialData);
    } else {
      setTransaction(INITIAL_TRANSACTION);
    }
  }, [initialData]);

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
      ...initialData,
      id: initialData?.id || "txn" + uuidv4(),
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
        <label>
          Name <span>*</span>
        </label>
        <input
          placeholder="Enter transaction name"
          value={transaction.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required={true}
        />
      </div>

      <div className="form-field">
        <label>
          Date <span>*</span>
        </label>
        <input
          type="date"
          value={transaction.date || today}
          onChange={(e) => handleChange("date", e.target.value)}
          required={true}
        />
      </div>

      <div className="form-field amount-field">
        <label>
          Amount <span>*</span>
        </label>
        <div className="input-with-symbol">
          <span className="currency-symbol">$</span>
          <input
            type="number"
            name="amount"
            placeholder="0.00"
            value={transaction.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            min={0}
            required={true}
          />
        </div>
      </div>

      <div className="form-field">
        <label>
          Type <span>*</span>
        </label>
        <select
          value={transaction.type}
          onChange={(e) => handleTypeChange(e.target.value)}
          required={true}
        >
          <option value="" disabled hidden>Select type</option>
          <option value={TRANSACTION_TYPE.INCOME}>Income</option>
          <option value={TRANSACTION_TYPE.EXPENSE}>Expense</option>
        </select>
      </div>

      <div className="form-field">
        <label>
          Category <span>*</span>
        </label>
        <select
          value={transaction.category}
          onChange={(e) => handleChange("category", e.target.value)}
          required={true}
        >
          <option value="" disabled hidden>Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {formatLabel(cat)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Notes</label>
        <textarea
          placeholder="Add any additional notes (optional)"
          value={transaction.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          required={false}
        />
      </div>

      <button type="submit">{initialData ? "Save Changes" : "Add Transaction"}</button>
    </form>
  );
};

export default TransactionForm;
