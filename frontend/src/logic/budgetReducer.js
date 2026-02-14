import {
  addTransaction,
  removeTransaction,
  updateTransaction,
} from "./budgetEngine";

/**
 * - ADD_TRANSACTION: adds a new transaction.
 * - REMOVE_TRANSACTION: removes a transaction by ID.
 * - UPDATE_TRANSACTION: updates an existing transaction by ID.
 */

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

export const BUDGET_ACTIONS = {
  ADD_TRANSACTION: "ADD_TRANSACTION",
  REMOVE_TRANSACTION: "REMOVE_TRANSACTION",
  UPDATE_TRANSACTION: "UPDATE_TRANSACTION",
};

export function budgetReducer(state, action) {
  switch (action.type) {
    // ADD_TRANSACTION: adds a new transaction.
    case BUDGET_ACTIONS.ADD_TRANSACTION: {
      const now = new Date().toISOString();

      const newTransaction = {
        ...action.payload,
        createdAt: now,
        updatedAt: now,
      };

      return {
        ...state,
        transactions: [...state.transactions, newTransaction],
      };
    }

    // REMOVE_TRANSACTION: removes a transaction by ID.
    case BUDGET_ACTIONS.REMOVE_TRANSACTION: {
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload,
        ),
      };
    }

    // UPDATE_TRANSACTION: updates an existing transaction by ID.
    case BUDGET_ACTIONS.UPDATE_TRANSACTION: {
      const now = new Date().toISOString();

      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id
            ? { ...action.payload, updatedAt: now }
            : transaction,
        ),
      };
    }

    // Default case: return current state
    default:
      console.warn(`Unhandled action type: ${action.type}`);
      return state;
  }
}
