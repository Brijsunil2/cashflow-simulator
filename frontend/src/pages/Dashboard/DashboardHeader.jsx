import React from 'react';

const DashboardHeader = () => (
    <header className="dashboard__header">
        <div className="dashboard__header-content">
            <div className="dashboard__header-text">
                <span className="dashboard__header-greeting">Welcome back,</span>
                <h1>CashFlow</h1>
                <p className="dashboard__header-subtitle">Dashboard</p>
            </div>
        </div>
    </header>
);

export default DashboardHeader;
