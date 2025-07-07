import React, { useState, useEffect } from 'react';
import TaskHeader from "./TaskHeader";
import TaskRewards from "./TaskRewards";
import TaskFooter from "./TaskFooter";
import TaskObjective from "./TaskObjective";

const TaskDetail = ({ selectedQuest }) => {
  const [isInTodo, setIsInTodo] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkIfTaskInTodo = async () => {
      if (!selectedQuest) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const API_URL = process.env.REACT_APP_API_URL || "https://tarkovwiki.onrender.com/api";
        const response = await fetch(`${API_URL}/todo`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setIsInTodo(data.todoTasks.includes(selectedQuest.task_id));
      } catch (err) {
        console.error('Error checking task status:', err);
      }
    };

    checkIfTaskInTodo();
  }, [selectedQuest]);

  const handleAddToTodo = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Mevcut token:', token);

      if (!token) {
        const errorMsg = 'Lütfen görev eklemek için giriş yapın';
        console.error(errorMsg);
        alert(errorMsg);
        window.location.href = '/'; // Ana sayfaya yönlendir
        return;
      }

      setError(null);
      console.log('Seçilen görev:', selectedQuest);
      
      if (!selectedQuest || !selectedQuest.task_id) {
        console.error('Görev verisi eksik:', selectedQuest);
        throw new Error('Geçersiz görev seçildi');
      }

      const API_URL = process.env.REACT_APP_API_URL || "https://tarkovwiki.onrender.com/api";
      const requestBody = { taskId: selectedQuest.task_id };
      console.log('Gönderilen veri:', requestBody);

      const response = await fetch(`${API_URL}/todo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Sunucu yanıt durumu:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Hata yanıtı:', errorData);
        
        if (response.status === 401) {
          localStorage.removeItem('token');
          alert('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.');
          window.location.href = '/'; // Ana sayfaya yönlendir
          return;
        }
        
        throw new Error(errorData.message || 'Görev eklenirken bir hata oluştu');
      }

      const data = await response.json();
      console.log('Görev başarıyla eklendi:', data);
      setIsInTodo(true);
    } catch (err) {
      console.error('Görev ekleme hatası:', err);
      setError(err.message);
      if (err.message.includes('Token has expired') || err.message.includes('Token is not valid')) {
        localStorage.removeItem('token');
        alert('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.');
        window.location.href = '/';
      } else {
        alert(err.message);
      }
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