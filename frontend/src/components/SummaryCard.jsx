const SummaryCard = ({ totalIncome, totalExpenses, netBalance}) => {
  return (
    <div >
        <p>Net Balance: {netBalance}</p>
        <p>Total Income: {totalIncome}</p>
        <p>Total Expenses: {totalExpenses}</p>
    </div>
  )
}

export default SummaryCard