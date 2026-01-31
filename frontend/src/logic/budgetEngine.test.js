import { describe, it, expect, beforeEach } from "vitest";
import {
  addTransactionToBudget,
  removeTransactionFromBudget,
  updateTransactionInBudget,
  getTotalIncome,
  getTotalExpenses,
  calculateBudgetBalance,
  getTransactionsByKind,
  TRANSACTION_KIND,
} from "./budgetEngine";

describe("Budget Engine", () => {
  let sampleBudget;

  beforeEach(() => {
    sampleBudget = {
      month: "2026-01",
      startingBalance: 1000,
      transactions: [
        {
          id: "1",
          name: "Salary",
          amount: 3000,
          date: "2026-01-01",
          kind: TRANSACTION_KIND.INCOME,
          category: "salary",
        },
        {
          id: "2",
          name: "Rent",
          amount: 1200,
          date: "2026-01-03",
          kind: TRANSACTION_KIND.EXPENSE,
          category: "rent",
        },
      ],
    };
  });

  // -------------------
  // Add Transaction
  // -------------------
  it("adds a transaction immutably", () => {
    const newTransaction = {
      id: "3",
      name: "Freelance",
      amount: 500,
      date: "2026-01-05",
      kind: TRANSACTION_KIND.INCOME,
      category: "freelance",
    };

    const newBudget = addTransactionToBudget(sampleBudget, newTransaction);

    expect(newBudget.transactions).toHaveLength(3);
    expect(newBudget.transactions[2]).toEqual(newTransaction);

    // original budget not mutated
    expect(sampleBudget.transactions).toHaveLength(2);
  });

  // -------------------
  // Remove Transaction
  // -------------------
  it("removes a transaction immutably", () => {
    const newBudget = removeTransactionFromBudget(sampleBudget, "1");

    expect(newBudget.transactions).toHaveLength(1);
    expect(newBudget.transactions[0].id).toBe("2");

    // original budget not mutated
    expect(sampleBudget.transactions).toHaveLength(2);
  });

  // -------------------
  // Update Transaction
  // -------------------
  it("updates a transaction immutably", () => {
    const updatedTransaction = {
      id: "2",
      name: "Rent (updated)",
      amount: 1300,
      date: "2026-01-03",
      kind: TRANSACTION_KIND.EXPENSE,
      category: "rent",
    };

    const newBudget = updateTransactionInBudget(
      sampleBudget,
      updatedTransaction,
    );

    expect(newBudget.transactions).toHaveLength(2);
    const transaction = newBudget.transactions.find((t) => t.id === "2");
    expect(transaction.name).toBe("Rent (updated)");
    expect(transaction.amount).toBe(1300);

    // original budget not mutated
    expect(sampleBudget.transactions.find((t) => t.id === "2").amount).toBe(
      1200,
    );
  });

  // -------------------
  // Total Income
  // -------------------
  it("calculates total income correctly", () => {
    const totalIncome = getTotalIncome(sampleBudget);
    expect(totalIncome).toBe(3000);

    const newBudget = addTransactionToBudget(sampleBudget, {
      id: "3",
      name: "Freelance",
      amount: 500,
      date: "2026-01-05",
      kind: TRANSACTION_KIND.INCOME,
      category: "freelance",
    });

    expect(getTotalIncome(newBudget)).toBe(3500);
  });

  // -------------------
  // Total Expenses
  // -------------------
  it("calculates total expenses correctly", () => {
    const totalExpenses = getTotalExpenses(sampleBudget);
    expect(totalExpenses).toBe(1200);
  });

  // -------------------
  // Calculate Budget Balance
  // -------------------
  it("calculates the final budget balance correctly", () => {
    const balance = calculateBudgetBalance(sampleBudget);
    // 1000 (starting) + 3000 (income) - 1200 (expenses) = 2800
    expect(balance).toBe(2800);
  });

  // -------------------
  // Filter by Kind
  // -------------------
  it("filters transactions by kind", () => {
    const incomes = getTransactionsByKind(
      sampleBudget,
      TRANSACTION_KIND.INCOME,
    );
    const expenses = getTransactionsByKind(
      sampleBudget,
      TRANSACTION_KIND.EXPENSE,
    );

    expect(incomes).toHaveLength(1);
    expect(incomes[0].kind).toBe(TRANSACTION_KIND.INCOME);

    expect(expenses).toHaveLength(1);
    expect(expenses[0].kind).toBe(TRANSACTION_KIND.EXPENSE);
  });
});
