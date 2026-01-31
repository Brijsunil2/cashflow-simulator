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

export const TRANSACTION_KIND = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const TRANSACTION_CATEGORY = {
  // Income
  SALARY: 'salary',
  FREELANCE: 'freelance',
  OTHER_INCOME: 'other_income',

  // Expenses
  RENT: 'rent',
  UTILITIES: 'utilities',
  GROCERIES: 'groceries',
  TRANSPORTATION: 'transportation',
  ENTERTAINMENT: 'entertainment',
  SUBSCRIPTIONS: 'subscriptions',
  OTHER_EXPENSE: 'other_expense',
};

/**
 * Calculates the final balance for the budget
 * startingBalance + totalIncome - totalExpenses
 *
 * @param {Budget} budget
 * @returns {number} final balance for the month
 */
function calculateBudgetBalance(budget) {};

/**
 * Adds a new transaction to the budget
 * Returns a new budget object (does not mutate)
 *
 * @param {Budget} budget
 * @param {Transaction} transaction
 * @returns {Budget} updated budget
 */
function addTransactionToBudget(budget, transaction) {

};

/**
 * Removes a transaction by ID
 * Returns a new budget object
 *
 * @param {Budget} budget
 * @param {string} transactionId
 * @returns {Budget} updated budget
 */
function removeTransactionFromBudget(budget, transactionId) {};

/**
 * Updates an existing transaction by ID
 * Replaces the matching transaction
 *
 * @param {Budget} budget
 * @param {Transaction} updatedTransaction
 * @returns {Budget} updated budget
 */
function updateTransactionInBudget(budget, updatedTransaction) {};

/**
 * Returns transactions matching a given category
 *
 * @param {Budget} budget
 * @param {string} category
 * @returns {Array<Transaction>}
 */
function getTransactionsByCategory(budget, category) {}

/**
 * Filters transactions by kind (income or expense)
 *
 * @param {Budget} budget
 * @param {'income' | 'expense'} kind
 * @returns {Array<Transaction>}
 */
function getTransactionsByKind(budget, kind) {};

/**
 * Calculates total income for the budget
 *
 * @param {Budget} budget
 * @returns {number} total income
 */
function getTotalIncome(budget) {};

/**
 * Calculates total expenses for the budget
 *
 * @param {Budget} budget
 * @returns {number} total expenses
 */
function getTotalExpenses(budget) {}

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
function getMonthlySummary(budget) {};