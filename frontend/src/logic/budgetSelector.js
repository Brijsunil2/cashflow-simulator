import { TRANSACTION_TYPE } from "./transactionConstants";

// budgetSelector.js

/**
 * Returns all transactions
 */
export const selectTransactions = (state) => state.transactions;

/**
 * Filters transactions by category
 */
export const selectTransactionsByCategory = (state, category) =>
  state.transactions.filter((transaction) => transaction.category === category);

/**
 * Filters transactions by type (income | expense)
 */
export const selectTransactionsByType = (state, type) =>
  state.transactions.filter(
    (transaction) => transaction.type.toLowerCase() === type,
  );

/**
 * Calculates total income
 */
export const selectTotalIncome = (state) =>
  selectTransactionsByType(state, TRANSACTION_TYPE.INCOME).reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

/**
 * Calculates total expenses
 */
export const selectTotalExpenses = (state) =>
  selectTransactionsByType(state, TRANSACTION_TYPE.EXPENSE).reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

/**
 * Calculates net balance
 */
export const selectNetBalance = (state) =>
  selectTotalIncome(state) - selectTotalExpenses(state);

/**
 * Returns aggregated summary
 */
export const selectSummary = (state) => ({
  totalIncome: selectTotalIncome(state),
  totalExpenses: selectTotalExpenses(state),
  netBalance: selectNetBalance(state),
});
