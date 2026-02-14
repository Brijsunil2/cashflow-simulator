export const TRANSACTION_TYPE = {
  INCOME: "income",
  EXPENSE: "expense",
};

export const INCOME_CATEGORIES = {
  SALARY: 'salary',
  FREELANCE: 'freelance',
  BUSINESS: 'business',
  BONUS: 'bonus',
  INTEREST: 'interest',
  DIVIDENDS: 'dividends',
  RENTAL: 'rental',
  GOVERNMENT: 'government',
  GIFT: 'gift',
  REFUND: 'refund',
  OTHER: 'other',
};

export const EXPENSE_CATEGORIES = {
  RENT: 'rent',
  UTILITIES: 'utilities',
  GROCERIES: 'groceries',
  TRANSPORTATION: 'transportation',
  ENTERTAINMENT: 'entertainment',
  SUBSCRIPTIONS: 'subscriptions',
  HEALTHCARE: 'healthcare',
  INSURANCE: 'insurance',
  DEBT: 'debt',
  OTHER: 'other',
};

export const INITIAL_TRANSACTION = {
  id: "",
  date: new Date().toISOString().split("T")[0],
  name: "",
  amount: 0,
  category: "",
  type: "",
  notes: "",
  createdAt: "",
  updatedAt: "",
};