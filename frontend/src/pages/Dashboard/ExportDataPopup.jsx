import React from 'react';
import Popup from "../../components/Popup/Popup";

const ExportDataPopup = ({
    isOpen,
    onClose,
    exportFileName,
    setExportFileName,
    onExport
}) => {
    return (
        <Popup
            isOpen={isOpen}
            onClose={onClose}
            title="Export Data"
        >
            <div className="dashboard__export-form">
                <p className="dashboard__export-help">Enter a name for your backup file:</p>
                <div className="dashboard__export-input-group">
                    <input
                        type="text"
                        className="dashboard__export-input"
                        value={exportFileName}
                        onChange={(e) => setExportFileName(e.target.value)}
                        placeholder="cashflow_data"
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && onExport()}
                    />
                    <span className="dashboard__export-extension">.json</span>
                </div>
                <div className="dashboard__export-actions">
                    <button
                        className="dashboard__btn dashboard__btn--secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="dashboard__btn add-transaction-btn"
                        onClick={onExport}
                    >
                        Download
                    </button>
                </div>
            </div>
        </Popup>
    );
};

export default ExportDataPopup;
