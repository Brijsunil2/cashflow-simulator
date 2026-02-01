import {
  addTransactionToBudget,
  removeTransactionFromBudget,
  updateTransactionInBudget,
} from "./budgetEngine";

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
