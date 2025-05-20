import React from "react";

const TaskHeader = ({ selectedQuest }) => {
  return (
    <div className="tq-task-info">
      <div className="label">TASK NAME</div>
      <div className="value">{selectedQuest.task_name}</div>

      <div className="label">LOCATION</div>
      <div className="value">{selectedQuest.location_name}</div>

      <div className="label">TRADER</div>
      <div className="value">{selectedQuest.trader_name}</div>
    </div>
  );
};

export default TaskHeader;