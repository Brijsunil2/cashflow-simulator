import "./SummaryCard.scss";

const SummaryCard = ({ totalIncome, totalExpenses, netBalance }) => {
  return (
    <section className="summary-group">
      <div className="summary-item summary-item--income">
        <div className="summary-item__info">
          <h2 className="summary-item__label">Income (All-time)</h2>
        </div>
        <p className="summary-item__value">
          ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      <div className="summary-item summary-item--expenses">
        <div className="summary-item__info">
          <h2 className="summary-item__label">Expenses (All-time)</h2>
        </div>
        <p className="summary-item__value">
          ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      <div className="summary-item summary-item--balance">
        <div className="summary-item__info">
          <h2 className="summary-item__label">Net Balance (All-time)</h2>
        </div>
        <p className={`summary-item__value neutral`}>
          {netBalance < 0 ? "-" : ""}${Math.abs(netBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </section>
  );
};

export default SummaryCard;
