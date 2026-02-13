import {
  addTransactionToBudget,
  removeTransactionFromBudget,
  updateTransactionInBudget,
} from "./budgetEngine";

/** 
 * - ADD_TRANSACTION: adds a new transaction.
 * - REMOVE_TRANSACTION: removes a transaction by ID.
 * - UPDATE_TRANSACTION: updates an existing transaction by ID.
 * - FILTER_TRANSACTIONS: filters transactions by category or date range (optional).
 * - CALCULATE_BALANCE: calculates the current balance between date range.
 * - CALCULATE_INCOME: calculates total income between date range.
 * - CALCULATE_EXPENSES: calculates total expenses between date range.
*/

export const BUDGET_ACTIONS = {
  ADD_TRANSACTION: "ADD_TRANSACTION",
  REMOVE_TRANSACTION: "REMOVE_TRANSACTION",
  UPDATE_TRANSACTION: "UPDATE_TRANSACTION",
};

export function budgetReducer(state, action) {
  switch (action.type) {
    case BUDGET_ACTIONS.ADD_TRANSACTION:
      return addTransactionToBudget(state, action.payload);
    case BUDGET_ACTIONS.REMOVE_TRANSACTION:
      return removeTransactionFromBudget(state, action.payload);
    case BUDGET_ACTIONS.UPDATE_TRANSACTION:
      return updateTransactionInBudget(state, action.payload);
    default:
      console.warn(`Unhandled action type: ${action.type}`);
      return state;
  }
}