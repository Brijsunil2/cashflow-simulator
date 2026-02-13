import { TRANSACTION_TYPE } from "./transactionConstants";

/**
 * {
 *   "userId": "user123",
 *   "currency": "CAD",
 *   "transactions": [
 *     {
 *       "id": "txn1",
 *       "date": "2026-01-01",
 *       "name": "Rent payment",
 *       "amount": 5000,
 *       "category": "Rent",
 *       "type": "Expense",
 *       "notes": "Paid via bank transfer"
 *       "createdAt": "2026-01-01T12:00:00Z",
 *       "updatedAt": "2026-01-01T12:00:00Z"
 *      },
 * ]}
 */

/**
 * Transaction shape
 * @property {string} id - Unique transaction identifier
 * @property {string} date - YYYY-MM-DD
 * @property {string} name - Display name
 * @property {number} amount - Positive numeric value
 * @property {string} category - e.g. rent, groceries, salary
 * @property {'income' | 'expense'} type - Direction of money
 * @property {string} notes - Optional freeform text
 * @property {string} createdAt - ISO timestamp of creation
 * @property {string} updatedAt - ISO timestamp of last update
 */

/**
 * Adds a new transaction
 * Automatically sets createdAt and updatedAt
 *
 * @param {Object} state
 * @param {Transaction} transaction
 * @returns {Object} updated state
 */
function addTransaction(state, transaction) {
  const now = new Date().toISOString();

  const newTransaction = {
    ...transaction,
    createdAt: now,
    updatedAt: now,
  };

  return {
    ...state,
    transactions: [...state.transactions, newTransaction],
  };
}

/**
 * Removes a transaction by ID
 *
 * @param {Object} state
 * @param {string} transactionId
 * @returns {Object} updated state
 */
function removeTransaction(state, transactionId) {
  return {
    ...state,
    transactions: state.transactions.filter(
      (transaction) => transaction.id !== transactionId,
    ),
  };
}

/**
 * Updates an existing transaction
 * Automatically updates updatedAt timestamp
 *
 * @param {Object} state
 * @param {Transaction} updatedTransaction
 * @returns {Object} updated state
 */
function updateTransaction(state, updatedTransaction) {
  const now = new Date().toISOString();

  return {
    ...state,
    transactions: state.transactions.map((transaction) =>
      transaction.id === updatedTransaction.id
        ? { ...updatedTransaction, updatedAt: now }
        : transaction,
    ),
  };
}

/**
 * Filters transactions by category
 *
 * @param {Object} state
 * @param {string} category
 * @returns {Array<Transaction>}
 */
function getTransactionsByCategory(state, category) {
  return state.transactions.filter(
    (transaction) => transaction.category === category,
  );
}

/**
 * Filters transactions by type (income or expense)
 *
 * @param {Object} state
 * @param {'income' | 'expense'} type
 * @returns {Array<Transaction>}
 */
function getTransactionsByType(state, type) {
  return state.transactions.filter((transaction) => transaction.type === type);
}

/**
 * Calculates total income
 *
 * @param {Object} state
 * @returns {number}
 */
function getTotalIncome(state) {
  return getTransactionsByType(state, "income").reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );
}

/**
 * Calculates total expenses
 *
 * @param {Object} state
 * @returns {number}
 */
function getTotalExpenses(state) {
  return getTransactionsByType(state, "expense").reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );
}

/**
 * Calculates net balance (income - expenses)
 *
 * @param {Object} state
 * @returns {number}
 */
function calculateNetBalance(state) {
  return getTotalIncome(state) - getTotalExpenses(state);
}

/**
 * Returns aggregated summary
 *
 * @param {Object} state
 * @returns {{
 *   totalIncome: number,
 *   totalExpenses: number,
 *   netBalance: number
 * }}
 */
function getSummary(state) {
  return {
    totalIncome: getTotalIncome(state),
    totalExpenses: getTotalExpenses(state),
    netBalance: calculateNetBalance(state),
  };
}

export {
  addTransaction,
  removeTransaction,
  updateTransaction,
  getTransactionsByCategory,
  getTransactionsByType,
  getTotalIncome,
  getTotalExpenses,
  calculateNetBalance,
  getSummary,
};
