import React, { useState, useEffect } from 'react';
import TaskHeader from "./TaskHeader";
import TaskRewards from "./TaskRewards";
import TaskFooter from "./TaskFooter";
import TaskObjective from "./TaskObjective";

const TaskDetail = ({ selectedQuest, todoTasks, onAddToTodo }) => {
  const [error, setError] = useState(null);

  // Doğrudan props ile kontrol
  const isInTodo = selectedQuest && todoTasks && todoTasks.map(String).includes(String(selectedQuest.task_id));

  const handleAddToTodo = async () => {
    try {
      if (!selectedQuest || !selectedQuest.task_id) {
        throw new Error('Geçersiz görev seçildi');
      }
      await onAddToTodo(selectedQuest.task_id);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!selectedQuest) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '20px',
        color: '#666',
        background: '#f5f5f5',
        borderRadius: '8px',
        margin: '20px'
      }}>
        Lütfen bir görev seçin
      </div>
    );
  }

  return (
    <div className="tq-task-detail">
      <div className="tq-task-header">
        <TaskHeader selectedQuest={selectedQuest} />
        <TaskRewards rewards={selectedQuest.rewards} />
      </div>

      {error && (
        <div style={{ 
          color: '#d32f2f', 
          background: '#fff0f0', 
          border: '1px solid #ffd6d6', 
          borderRadius: 6, 
          padding: 10, 
          margin: '10px 0',
          textAlign: 'center' 
        }}>
          {error}
        </div>
      )}

      <TaskFooter 
        requiredForKappa={selectedQuest.required_for_kappa}
        requiredForLightkeeper={selectedQuest.required_for_lightkeeper}
        onAddToTodo={handleAddToTodo}
        isInTodo={isInTodo}
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