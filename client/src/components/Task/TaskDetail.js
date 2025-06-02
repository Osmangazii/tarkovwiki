import React from "react";
import TaskHeader from "./TaskHeader";
import TaskRewards from "./TaskRewards";
import TaskFooter from "./TaskFooter";
import TaskObjective from "./TaskObjective";

const TaskDetail = ({ selectedQuest }) => {
  return (
    <div className="tq-task-detail">
      <div className="tq-task-header">
        <TaskHeader selectedQuest={selectedQuest} />
        <TaskRewards rewards={selectedQuest.rewards} />
      </div>

      <TaskFooter 
        requiredForKappa={selectedQuest.required_for_kappa}
        requiredForLightkeeper={selectedQuest.required_for_lightkeeper}
      />

      <div className="progress-bar">
        <div className="progress" style={{ width: "30%" }}></div>
      </div>

      {/* Objectives */}
      {selectedQuest.objectives.map((objective, index) => (
        <TaskObjective key={index} objective={objective} />
      ))}
    </div>
  );
};

export default TaskDetail; 