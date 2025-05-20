import React from "react";

const TabMenu = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="tq-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tq-tab-btn ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabMenu;