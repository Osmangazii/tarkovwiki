import React, { useState, useEffect } from 'react';
import questData from '../data/questData.json';

const MyTasksTab = ({ onSelectQuest, questData, todoTasks, fetchTodoTasks }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []); // Sadece mount olduğunda fetch et

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
      
      if (response.status === 204) {
        setTasks([]);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }
      
      const data = await response.json();
      // Artık {task_id, completed} objeleriyle çalışıyoruz
      setTasks(data.todoTasks);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const updateCompleted = async (taskId, completed) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.REACT_APP_API_URL || "https://tarkovwiki.onrender.com/api";
      const response = await fetch(`${API_URL}/todo/${taskId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update completed');
      }
      await fetchTasks();
      await fetchTodoTasks();
    } catch (err) {
      setError(err.message);
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
      setTasks(tasks.filter(task => String(task.task_id) !== String(taskId)));
      await fetchTodoTasks();
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

  // Tamamlanmamışlar üstte, tamamlananlar altta olacak şekilde sırala
  const sortedTasks = [...tasks].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

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
          {sortedTasks.map(({ task_id, completed }) => {
            const taskInfo = getTaskInfo(task_id);
            return (
              <div 
                key={task_id} 
                className="task-item" 
                onClick={() => onSelectQuest(taskInfo)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  marginBottom: '8px',
                  background: completed ? '#f5f5f5' : '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  opacity: completed ? 0.5 : 1
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="checkbox"
                    checked={!!completed}
                    onChange={e => {
                      e.stopPropagation();
                      updateCompleted(task_id, e.target.checked);
                    }}
                    onClick={e => e.stopPropagation()}
                    style={{
                      width: 22,
                      height: 22,
                      accentColor: completed ? '#4CAF50' : '#7b2ff2',
                      borderRadius: 6,
                      border: '2px solid #7b2ff2',
                      boxShadow: completed ? '0 0 0 2px #4CAF5033' : '0 0 0 2px #7b2ff233',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      marginRight: 6
                    }}
                  />
                  <span className="task-name" style={{ fontSize: '16px', textDecoration: completed ? 'line-through' : 'none' }}>{taskInfo.task_name}</span>
                </div>
                <button
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTask(task_id);
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