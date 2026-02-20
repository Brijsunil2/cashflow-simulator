import { FaCircle } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { TRANSACTION_TYPE } from "../../logic/transactionConstants";
import { formatLabel } from "../../util/stringManipulation";
import HoverCard from "../HoverCard/HoverCard";

const TransactionItem = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === TRANSACTION_TYPE.INCOME;

  const trigger = (
    <div className="transaction-item__row">
      <span className="transaction-item__name">
        <FaCircle
          className={`transaction-type-icon ${
            isIncome ? "income" : "expense"
          }`}
        />
        {transaction.name}
      </span>

      <span
        className={`transaction-item__amount ${
          isIncome ? "income" : "expense"
        }`}
      >
        {`${isIncome ? "" : "-"}$${transaction.amount}`}
      </span>

      <span className="transaction-item__actions">
        <RiDeleteBin6Fill
          className="icon-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(transaction.id);
          }}
        />
      </span>
    </div>
  );

  return (
    <HoverCard trigger={trigger}>
      <div className="transaction-details">
        <div className="details-header">
          <p>
            <strong>Category:</strong> {formatLabel(transaction.category)}
          </p>

          <p className={`transaction-type ${isIncome ? "income" : "expense"}`}>
            {formatLabel(transaction.type)}
          </p>
        </div>

        <div className="transaction-notes">
          <p>{transaction.notes || "No additional notes."}</p>
        </div>

        <div className="transaction-dates">
          <p>
            <strong>Created:</strong>{" "}
            {new Date(transaction.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Updated:</strong>{" "}
            {new Date(transaction.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </HoverCard>
  );
};

export default TransactionItem;