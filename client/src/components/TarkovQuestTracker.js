import { useState } from "react";
import "./TarkovQuestTracker.css";
import questData from "../data/questData.json";
import Header from "./Header";
import TabMenu from "./TabMenu";
import TaskDetail from "./TaskDetail";
import AllTasksTab from "./AllTasksTab";
import PlaceholderTab from "./PlaceholderTab";

export default function TarkovQuestTracker() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [selectedQuest, setSelectedQuest] = useState(questData[0]);
  
  const tabs = [
    { id: "quest-roadmap", label: "ALL TASKS" },
    { id: "tasks", label: "TASK" },
    { id: "goons-tracker", label: "GOONS TRACKER" },
    { id: "keys", label: "KEYS" },
    { id: "hideout", label: "HIDEOUT" },
  ];

  const handleSelectQuest = (quest) => {
    setSelectedQuest(quest);
    setActiveTab("tasks");
  };

  return (
    <div className="tq-bg">
      <div className="tq-container">
        <Header />
        <TabMenu tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="tq-content">
          {activeTab === "tasks" && (
            <TaskDetail selectedQuest={selectedQuest} />
          )}
          
          {activeTab === "quest-roadmap" && (
            <AllTasksTab 
              questData={questData} 
              selectedQuest={selectedQuest}
              onSelectQuest={handleSelectQuest}
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