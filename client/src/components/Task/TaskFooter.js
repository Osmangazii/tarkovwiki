import React from "react";

const TaskFooter = ({ requiredForKappa, requiredForLightkeeper, onAddToTodo, isInTodo }) => {
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
      <button 
        className="add-btn"
        onClick={onAddToTodo}
        disabled={isInTodo}
        style={{
          background: isInTodo 
            ? "linear-gradient(90deg, #4CAF50 0%, #45a049 100%)"
            : "linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "10px 20px",
          cursor: isInTodo ? "default" : "pointer",
          fontSize: 14,
          fontWeight: 600,
          opacity: isInTodo ? 0.7 : 1
        }}
      >
        {isInTodo ? "ADDED TO TODO" : "ADD TO TO-DO TASKS"}
      </button>
    </div>
  );
};

export default TaskFooter; 