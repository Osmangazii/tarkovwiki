import React from "react";

const QuestRoadmap = ({ questData, selectedQuest, onSelectQuest }) => {
  return (
    <div className="tq-roadmap">
      {questData.map((quest) => (
        <div
          key={quest.task_id}
          className={`roadmap-item ${
            selectedQuest.task_id === quest.task_id ? "active" : ""
          }`}
          onClick={() => onSelectQuest(quest)}
        >
          <div className="title">{quest.task_name}</div>
          <div className="subtitle">
            {quest.trader_name} - {quest.location_name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestRoadmap;