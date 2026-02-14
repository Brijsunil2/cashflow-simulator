import { describe, it, expect } from "vitest";
import {
  selectTransactionsByCategory,
  selectTransactionsByType,
  selectTotalIncome,
  selectTotalExpenses,
  selectNetBalance,
  selectSummary,
} from "./budgetSelector";

const mockState = {
  userId: "user123",
  currency: "CAD",
  transactions: [
    {
      id: "1",
      category: "Salary",
      amount: 5000,
      type: "income",
    },
    {
      id: "2",
      category: "Rent",
      amount: 1500,
      type: "expense",
    },
    {
      id: "3",
      category: "Freelance",
      amount: 1000,
      type: "income",
    },
  ],
};

describe("budgetSelector", () => {
  it("should filter by category", () => {
    const result = selectTransactionsByCategory(mockState, "Rent");
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("2");
  });

  it("should filter by type", () => {
    const income = selectTransactionsByType(mockState, "income");
    expect(income.length).toBe(2);
  });

  it("should calculate total income", () => {
    const total = selectTotalIncome(mockState);
    expect(total).toBe(6000);
  });

  it("should calculate total expenses", () => {
    const total = selectTotalExpenses(mockState);
    expect(total).toBe(1500);
  });

  it("should calculate net balance", () => {
    const balance = selectNetBalance(mockState);
    expect(balance).toBe(4500);
  });

  it("should return full summary", () => {
    const summary = selectSummary(mockState);

    expect(summary).toEqual({
      totalIncome: 6000,
      totalExpenses: 1500,
      netBalance: 4500,
    });
  });
});
