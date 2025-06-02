import React from "react";

const TaskFooter = ({ requiredForKappa, requiredForLightkeeper }) => {
  return (
    <div className="tq-task-footer">
      <div className="flags">
        {requiredForKappa && (
          <span className="flag kappa">KAPPA</span>
        )}
        {requiredForLightkeeper && (
          <span className="flag lightkeeper">LIGHTKEEPER</span>
        )}
      </div>
      <button className="add-btn">ADD TO TO-DO TASKS</button>
    </div>
  );
};

export default TaskFooter; 