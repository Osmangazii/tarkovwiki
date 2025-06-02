import React from "react";

const TaskObjective = ({ objective }) => {
  return (
    <div className="objective">
      <p>{objective}</p>
      <div className="objective-cards">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card">
            📘
          </div>
        ))}
      </div>
      <div className="check-btn">✔️</div>
    </div>
  );
};

export default TaskObjective; 