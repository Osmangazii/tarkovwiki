import React from "react";

const AllTasksTab = ({ questData, selectedQuest, onSelectQuest }) => {
  return (
    <div className="tq-roadmap">
      {questData.map((quest) => (
        <div
          key={quest.task_id}
          className={`roadmap-item ${
            selectedQuest.task_id === quest.task_id ? "active" : ""
          }`}
          onClick={() => onSelectQuest(quest)}
          style={{
            cursor: 'pointer',
            padding: '12px',
            marginBottom: '8px',
            background: selectedQuest.task_id === quest.task_id ? '#f0e6ff' : '#fff',
            borderRadius: '8px',
            border: '1px solid #eee',
            transition: 'all 0.2s'
          }}
        >
          <div className="title" style={{ 
            fontSize: '16px',
            color: selectedQuest.task_id === quest.task_id ? '#7b2ff2' : '#333',
            fontWeight: selectedQuest.task_id === quest.task_id ? 600 : 400
          }}>
            {quest.task_name}
          </div>
          <div className="subtitle" style={{ 
            fontSize: '14px',
            color: '#666',
            marginTop: '4px'
          }}>
            {quest.trader_name} - {quest.location_name}
          </div>
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            {quest.required_for_kappa && (
              <span style={{
                background: '#7b2ff2',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'inline-block'
              }}>
                KAPPA
              </span>
            )}
            {quest.required_for_lightkeeper && (
              <span style={{
                background: '#f357a8',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'inline-block'
              }}>
                LIGHTKEEPER
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllTasksTab;