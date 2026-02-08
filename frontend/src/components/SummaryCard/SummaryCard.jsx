import "./SummaryCard.scss";

const SummaryCard = ({ totalIncome, totalExpenses, netBalance }) => {
  return (
    <section className="summary-card">
      <div className="card card--balance">
        <h2 className="card__label">Net Balance</h2>
        <p className="card__value">${netBalance}</p>
      </div>
      <div className="card card--income">
        <h2 className="card__label">Total Income</h2>
        <p className="card__value">${totalIncome}</p>
      </div>
      <div className="card card--expenses">
        <h2 className="card__label">Total Expenses</h2>
        <p className="card__value">${totalExpenses}</p>
      </div>
    </section>
  );
};

export default SummaryCard;
