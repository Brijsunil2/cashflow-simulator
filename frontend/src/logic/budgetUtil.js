export const createTransaction = (payload) => {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    ...payload,
    date: new Date(payload.date).toISOString().split("T")[0],
    createdAt: now,
    updatedAt: now,
  };
};