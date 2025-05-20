import React from "react";

const Header = () => {
  return (
    <div className="tq-header">
      <h1 className="tq-title">Tarkov Tiki</h1>
      <div className="tq-search">
        <input type="text" placeholder="TASK NAME" />
        <button className="icon-btn">🔍</button>
        <button className="icon-btn">⚙️</button>
      </div>
    </div>
  );
};

export default Header;