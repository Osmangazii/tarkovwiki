import { useState } from "react";
import "./TarkovQuestTracker.css";
import questData from "../data/questData.json";

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

  return (
    <div className="tq-bg">
      <div className="tq-container">
        {/* Header */}
        <div className="tq-header">
          <h1 className="tq-title">Tarkov Tiki</h1>
          <div className="tq-search">
            <input type="text" placeholder="TASK NAME" />
            <button className="icon-btn">🔍</button>
            <button className="icon-btn">⚙️</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tq-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tq-tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="tq-content">
          {activeTab === "tasks" && (
            <div className="tq-task-detail">
              <div className="tq-task-header">
                <div className="tq-task-info">
                  <div className="label">TASK NAME</div>
                  <div className="value">{selectedQuest.task_name}</div>

                  <div className="label">LOCATION</div>
                  <div className="value">{selectedQuest.location_name}</div>

                  <div className="label">TRADER</div>
                  <div className="value">{selectedQuest.trader_name}</div>
                </div>

                <div className="tq-rewards">
                  <div className="label">REWARDS</div>
                  <ul className="rewards-list">
                    {selectedQuest.rewards.map((reward, i) => (
                      <li key={i}>{reward}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="tq-task-footer">
                <div className="flags">
                  {selectedQuest.required_for_kappa && (
                    <span className="flag kappa">KAPPA</span>
                  )}
                  {selectedQuest.required_for_lightkeeper && (
                    <span className="flag lightkeeper">LIGHTKEEPER</span>
                  )}
                </div>
                <button className="add-btn">ADD TO TO-DO TASKS</button>
              </div>

              <div className="progress-bar">
                <div className="progress" style={{ width: "30%" }}></div>
              </div>

              {/* Objectives */}
              {selectedQuest.objectives.map((objective, index) => (
                <div key={index} className="objective">
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
              ))}
            </div>
          )}

          {activeTab === "quest-roadmap" && (
            <div className="tq-roadmap">
              {questData.map((quest) => (
                <div
                  key={quest.task_id}
                  className={`roadmap-item ${
                    selectedQuest.task_id === quest.task_id ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedQuest(quest);
                    setActiveTab("tasks");
                  }}
                >
                  <div className="title">{quest.task_name}</div>
                  <div className="subtitle">
                    {quest.trader_name} - {quest.location_name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {["goons-tracker", "keys", "hideout"].includes(activeTab) && (
            <div className="placeholder-tab">Bu sekme henüz uygulanmadı.</div>
          )}
        </div>
      </div>
    </div>
  );
}
