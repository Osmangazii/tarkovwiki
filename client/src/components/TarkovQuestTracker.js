import { useState } from "react";
import "./TarkovQuestTracker.css";
import questData from "../data/questData.json";
import { Header, TabMenu, PlaceholderTab } from "./common";
import { TaskDetail } from "./Task";
import AllTasksTab from "./AllTasksTab";
import MyTasksTab from "./MyTasksTab";

export default function TarkovQuestTracker() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [selectedQuest, setSelectedQuest] = useState(questData[0]);
  const [searchValue, setSearchValue] = useState("");

  const tabs = [
    { id: "quest-roadmap", label: "ALL TASKS" },
    { id: "tasks", label: "TASK" },
    { id: "my-tasks", label: "MY TASKS" },
    { id: "goons-tracker", label: "GOONS TRACKER" },
    { id: "keys", label: "KEYS" },
    { id: "hideout", label: "HIDEOUT" },
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

  return (
    <div className="tq-bg">
      <div className="tq-container">
        <Header />
        <TabMenu tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="tq-content" style={{ minHeight: 'calc(100vh - 200px)', position: 'relative' }}>
          {activeTab === "quest-roadmap" && (
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
          {activeTab === "tasks" && (
            <TaskDetail selectedQuest={selectedQuest} />
          )}
          {activeTab === "quest-roadmap" && (
            <AllTasksTab
              questData={filteredQuests}
              selectedQuest={selectedQuest}
              onSelectQuest={handleSelectQuest}
            />
          )}
          {activeTab === "my-tasks" && (
            <MyTasksTab 
              onSelectQuest={handleSelectQuest}
              questData={questData}
            />
          )}
          {["goons-tracker", "keys", "hideout"].includes(activeTab) && (
            <PlaceholderTab />
          )}
        </div>
      </div>
    </div>
  );
}