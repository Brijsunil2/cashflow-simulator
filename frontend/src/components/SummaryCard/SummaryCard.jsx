import "./SummaryCard.scss";

const SummaryCard = ({ totalIncome, totalExpenses, netBalance }) => {
  return (
    <section className="summary-group">
      <div className="summary-item summary-item--income">
        <div className="summary-item__info">
          <h2 className="summary-item__label">Total Income</h2>
          <p className="summary-item__description">Total income is the sum of all income transactions.</p>
        </div>
        <p className="summary-item__value">
          ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      <div className="summary-item summary-item--expenses">
        <div className="summary-item__info">
          <h2 className="summary-item__label">Total Expenses</h2>
          <p className="summary-item__description">Total expenses is the sum of all expense transactions.</p>
        </div>
        <p className="summary-item__value">
          ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      <div className="summary-item summary-item--balance">
        <div className="summary-item__info">
          <h2 className="summary-item__label">Net Balance</h2>
          <p className="summary-item__description">Net balance is the difference between total income and total expenses.</p>
        </div>
        <p className={`summary-item__value ${netBalance >= 0 ? 'positive' : 'negative'}`}>
          {netBalance < 0 ? "-" : ""}${Math.abs(netBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </section>
  );
};

export default SummaryCard;
