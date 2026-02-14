import { describe, it, expect } from "vitest";
import { budgetReducer, BUDGET_ACTIONS } from "./budgetReducer";

const initialState = {
  userId: "user123",
  currency: "CAD",
  transactions: [],
};

describe("budgetReducer", () => {
  it("should add a transaction", () => {
    const transaction = {
      id: "txn1",
      date: "2026-01-01",
      name: "Salary",
      amount: 5000,
      category: "Salary",
      type: "income",
      notes: "",
    };

    const newState = budgetReducer(initialState, {
      type: BUDGET_ACTIONS.ADD_TRANSACTION,
      payload: transaction,
    });

    expect(newState.transactions.length).toBe(1);
    expect(newState.transactions[0].id).toBe("txn1");
    expect(newState.transactions[0].createdAt).toBeDefined();
    expect(newState.transactions[0].updatedAt).toBeDefined();
  });

  it("should remove a transaction", () => {
    const stateWithTransaction = {
      ...initialState,
      transactions: [
        {
          id: "txn1",
          amount: 100,
          type: "income",
        },
      ],
    };

    const newState = budgetReducer(stateWithTransaction, {
      type: BUDGET_ACTIONS.REMOVE_TRANSACTION,
      payload: "txn1",
    });

    expect(newState.transactions.length).toBe(0);
  });

  it("should update a transaction", () => {
    const stateWithTransaction = {
      ...initialState,
      transactions: [
        {
          id: "txn1",
          amount: 100,
          type: "income",
          updatedAt: "old-date",
        },
      ],
    };

    const updatedTransaction = {
      id: "txn1",
      amount: 200,
      type: "income",
    };

    const newState = budgetReducer(stateWithTransaction, {
      type: BUDGET_ACTIONS.UPDATE_TRANSACTION,
      payload: updatedTransaction,
    });

    expect(newState.transactions[0].amount).toBe(200);
    expect(newState.transactions[0].updatedAt).not.toBe("old-date");
  });

  it("should return current state for unknown action", () => {
    const newState = budgetReducer(initialState, {
      type: "UNKNOWN",
    });

    expect(newState).toEqual(initialState);
  });
});
