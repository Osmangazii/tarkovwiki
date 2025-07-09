import React, { useState, useEffect } from 'react';
import "./TarkovQuestTracker.css";
import questData from "../data/questData.json";
import { Header, TabMenu, PlaceholderTab } from "./common";
import { TaskDetail } from "./Task";
import AllTasksTab from "./AllTasksTab";
import MyTasksTab from "./MyTasksTab";
import Hideout from './Hideout';

const TarkovQuestTracker = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedQuest, setSelectedQuest] = useState(questData[0]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [todoTasks, setTodoTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setUsername(localStorage.getItem('username'));
    }
    fetchTodoTasks();
  }, []);

  const fetchTodoTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const API_URL = process.env.REACT_APP_API_URL || "https://tarkovwiki.onrender.com/api";
      const response = await fetch(`${API_URL}/todo`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) return;
      const data = await response.json();
      // Sadece taskId dizisi olarak kaydet!
      setTodoTasks(data.todoTasks.map(row => row.task_id ? row.task_id : row));
    } catch (err) {
      // ignore
    }
  };

  const handleAddToTodo = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const API_URL = process.env.REACT_APP_API_URL || "https://tarkovwiki.onrender.com/api";
      const response = await fetch(`${API_URL}/todo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ taskId })
      });
      if (!response.ok) return;
      await fetchTodoTasks();
      setSelectedQuest(prev => ({ ...prev })); // <-- Eklendi: yeniden render tetiklesin
    } catch (err) {
      // ignore
    }
  };

  const tabs = [
    { id: 'all', label: 'ALL TASKS' },
    { id: 'my', label: 'MY TASKS' },
    { id: 'goons', label: 'GOONS TRACKER' },
    { id: 'keys', label: 'KEYS' },
    { id: 'hideout', label: 'HIDEOUT' }
  ];

  const handleSelectQuest = (quest) => {
    console.log('Seçilen görev:', quest);
    setSelectedQuest(quest);
    setActiveTab("tasks");
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Filter quests for AllTasksTab
  const filteredQuests = questData.filter((quest) =>
    quest.task_name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'all':
        return <AllTasksTab questData={filteredQuests} selectedQuest={selectedQuest} onSelectQuest={handleSelectQuest} />;
      case 'my':
        return isLoggedIn ? <MyTasksTab questData={questData} selectedQuest={selectedQuest} onSelectQuest={handleSelectQuest} todoTasks={todoTasks} fetchTodoTasks={fetchTodoTasks} /> : <div>Please login to view your tasks.</div>;
      case 'goons':
        return <div style={{ padding: '20px', textAlign: 'center' }}>This page is not created yet.</div>;
      case 'keys':
        return <div style={{ padding: '20px', textAlign: 'center' }}>This page is not created yet.</div>;
      case 'hideout':
        return isLoggedIn ? <Hideout /> : <div>Please login to view your hideout.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="tq-bg">
      <div className="tq-container">
        <Header />
        <TabMenu tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="tq-content" style={{ minHeight: 'calc(100vh - 200px)', position: 'relative' }}>
          {activeTab === "tasks" && (
            <TaskDetail selectedQuest={selectedQuest} todoTasks={todoTasks} onAddToTodo={handleAddToTodo} />
          )}
          {activeTab === "all" && (
            <div className="tq-search" style={{ marginBottom: 16 }}>
              <input
                type="text"
                placeholder="TASK NAME"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <button className="icon-btn">🔍</button>
            </div>
          )}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TarkovQuestTracker;