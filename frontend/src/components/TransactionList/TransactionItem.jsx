import { FaCircle, FaEllipsisV } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { useState } from "react";
import Popup from "../Popup/Popup";
import TransactionForm from "../TransactionForm/TransactionForm";
import { TRANSACTION_TYPE } from "../../logic/transactionConstants";
import { formatLabel } from "../../util/stringManipulation";
import HoverCard from "../HoverCard/HoverCard";

const TransactionItem = ({ transaction, onDelete, onEdit }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isIncome = transaction.type === TRANSACTION_TYPE.INCOME;

  const trigger = (
    <div className="transaction-item__row">
      <span className="transaction-item__name">
        <FaCircle
          className={`transaction-type-icon ${isIncome ? "income" : "expense"
            }`}
        />
        {transaction.name}
      </span>

      <span
        className={`transaction-item__amount ${isIncome ? "income" : "expense"
          }`}
      >
        {`${isIncome ? "" : "-"}$${transaction.amount}`}
      </span>

      <span className="transaction-item__actions" onClick={(e) => e.stopPropagation()}>
        <HoverCard
          clickOnly={true}
          align="right"
          minWidth="auto"
          trigger={
            <div className="icon-menu" onClick={() => setShowDeleteConfirm(false)}>
              <FaEllipsisV />
            </div>
          }
        >
          <div className="kebab-menu-dropdown">
            {!showDeleteConfirm ? (
              <>
                <button
                  className="kebab-menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditOpen(true);
                    document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
                  }}
                >
                  <MdEdit /> Edit
                </button>
                <div className="kebab-menu-divider" />
                <button
                  className="kebab-menu-item kebab-menu-item--danger"
                  onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
                >
                  <RiDeleteBin6Fill /> Delete
                </button>
              </>
            ) : (
              <div
                className="delete-confirmation-popover"
                onClick={(e) => e.stopPropagation()}
              >
                <p>Delete transaction?</p>
                <div className="delete-confirmation-popover-actions">
                  <button className="btn-cancel" onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(false); }}>Cancel</button>
                  <button
                    className="btn-delete-confirm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(transaction.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </HoverCard>
      </span>
    </div>
  );

  return (
    <>
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

      <Popup
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Transaction"
      >
        <div className="dashboard__form">
          <TransactionForm
            initialData={transaction}
            onSubmit={(updatedTransaction) => {
              setIsEditOpen(false);
              if (onEdit) onEdit(updatedTransaction);
            }}
          />
        </div>
      </Popup>
    </>
  );
};

export default TransactionItem;