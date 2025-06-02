import React from "react";

const TaskRewards = ({ rewards }) => {
  return (
    <div className="tq-rewards">
      <div className="label">REWARDS</div>
      <ul className="rewards-list">
        {rewards.map((reward, i) => (
          <li key={i}>{reward}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskRewards; 