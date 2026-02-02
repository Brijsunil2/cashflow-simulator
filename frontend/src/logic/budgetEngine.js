import { TRANSACTION_KIND } from "./transactionConstants";

/**
 * Budget shape
 * @property {string} month - Budget month in YYYY-MM format
 * @property {number} startingBalance - Balance at start of month
 * @property {Array<Transaction>} transactions - All income & expense entries
 */

/**
 * Transaction shape
 * @property {string} id - Unique transaction identifier
 * @property {string} name - Display name
 * @property {number} amount - Positive numeric value
 * @property {string} date - YYYY-MM-DD
 * @property {string} category - e.g. rent, groceries, salary
 * @property {'income' | 'expense'} kind - Direction of money
 */

/**
 * Adds a new transaction to the budget
 * Returns a new budget object (does not mutate)
 *
 * @param {Budget} budget
 * @param {Transaction} transaction
 * @returns {Budget} updated budget
 */
function addTransactionToBudget(budget, transaction) {
  return {
    ...budget,
    transactions: [...budget.transactions, transaction],
  };
}

/**
 * Removes a transaction by ID
 * Returns a new budget object
 *
 * @param {Budget} budget
 * @param {string} transactionId
 * @returns {Budget} updated budget
 */
function removeTransactionFromBudget(budget, transactionId) {
  return {
    ...budget,
    transactions: budget.transactions.filter(
      (transaction) => transaction.id !== transactionId,
    ),
  };
}

/**
 * Updates an existing transaction by ID
 * Replaces the matching transaction
 *
 * @param {Budget} budget
 * @param {Transaction} updatedTransaction
 * @returns {Budget} updated budget
 */
function updateTransactionInBudget(budget, updatedTransaction) {
  return {
    ...budget,
    transactions: budget.transactions.map((transaction) =>
      transaction.id === updatedTransaction.id
        ? updatedTransaction
        : transaction,
    ),
  };
}

/**
 * Returns transactions matching a given category
 *
 * @param {Budget} budget
 * @param {string} category
 * @returns {Array<Transaction>}
 */
function getTransactionsByCategory(budget, category) {
  return budget.transactions.filter(
    (transaction) => transaction.category === category,
  );
}

/**
 * Filters transactions by kind (income or expense)
 *
 * @param {Budget} budget
 * @param {'income' | 'expense'} kind
 * @returns {Array<Transaction>}
 */
function getTransactionsByKind(budget, kind) {
  return budget.transactions.filter((transaction) => transaction.kind === kind);
}

/**
 * Calculates total income for the budget
 *
 * @param {Budget} budget
 * @returns {number} total income
 */
function getTotalIncome(budget) {
  const incomeTransactions = getTransactionsByKind(
    budget,
    TRANSACTION_KIND.INCOME,
  );
  return incomeTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );
}

/**
 * Calculates total expenses for the budget
 *
 * @param {Budget} budget
 * @returns {number} total expenses
 */
function getTotalExpenses(budget) {
  const expenseTransactions = getTransactionsByKind(
    budget,
    TRANSACTION_KIND.EXPENSE,
  );
  return expenseTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );
}

/**
 * Calculates the final balance for the budget
 * startingBalance + totalIncome - totalExpenses
 *
 * @param {Budget} budget
 * @returns {number} final balance for the month
 */
function calculateBudgetBalance(budget) {
  const totalIncome = getTotalIncome(budget);
  const totalExpenses = getTotalExpenses(budget);
  return budget.startingBalance + totalIncome - totalExpenses;
}

/**
 * Computes aggregated budget data for display
 *
 * @param {Budget} budget
 * @returns {{
 *   totalIncome: number,
 *   totalExpenses: number,
 *   netBalance: number
 * }}
 */
function getMonthlySummary(budget) {
  return {
    totalIncome: getTotalIncome(budget),
    totalExpenses: getTotalExpenses(budget),
    netBalance: calculateBudgetBalance(budget),
  };
}

export {
  addTransactionToBudget,
  removeTransactionFromBudget,
  updateTransactionInBudget,
  getTransactionsByCategory,
  getTransactionsByKind,
  getTotalIncome,
  getTotalExpenses,
  calculateBudgetBalance,
  getMonthlySummary,
};
