import React, { useState, useEffect } from 'react';
import questData from '../data/questData.json';

const MyTasksTab = ({ onSelectQuest, questData }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view your tasks');
        setLoading(false);
        return;
      }

      const API_URL = process.env.REACT_APP_API_URL || "https://tarkovwiki.onrender.com/api";
      const response = await fetch(`${API_URL}/todo`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data.todoTasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.REACT_APP_API_URL || "https://tarkovwiki.onrender.com/api";
      const response = await fetch(`${API_URL}/todo/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove task');
      }
      
      setTasks(tasks.filter(task => task !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loading" style={{ textAlign: 'center', padding: '20px' }}>Loading tasks...</div>;
  }

  if (error) {
    return <div className="error" style={{ 
      color: '#d32f2f', 
      background: '#fff0f0', 
      border: '1px solid #ffd6d6', 
      borderRadius: 6, 
      padding: 10, 
      margin: '10px 0',
      textAlign: 'center' 
    }}>{error}</div>;
  }

  const getTaskInfo = (taskId) => {
    return questData.find(quest => String(quest.task_id) === String(taskId)) || { task_name: 'Unknown Task' };
  };

  return (
    <div className="my-tasks" style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>My Tasks</h2>
      {tasks.length === 0 ? (
        <div className="no-tasks" style={{ 
          textAlign: 'center', 
          color: '#666',
          padding: '20px',
          background: '#f5f5f5',
          borderRadius: '8px'
        }}>
          No tasks added yet. Add tasks from the main task list!
        </div>
      ) : (
        <div className="task-list">
          {tasks.map(taskId => {
            const taskInfo = getTaskInfo(taskId);
            return (
              <div 
                key={taskId} 
                className="task-item" 
                onClick={() => onSelectQuest(taskInfo)}
                style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                marginBottom: '8px',
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer'
                }}>
                <span className="task-name" style={{ fontSize: '16px' }}>{taskInfo.task_name}</span>
                <button
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTask(taskId);
                  }}
                  style={{
                    background: "linear-gradient(90deg, #ff4b4b 0%, #ff7676 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontSize: 14
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTasksTab; 