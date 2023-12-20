import React from "react";
import "./styles.css";


const DashboardComponent = () => {
  return (
    <div className="screen">
      <div className="main-window">
        <div className="top-info-bar">{/* Top info bar component */}</div>
        <div className="video-container">
          {/* Videos Here */} a
        </div>
        <div className="bottom-action-bar">
          {/* Action Buttons here. */}
          <div className="circular-buttons">{/* Action ?? */}</div>
        </div>
      </div>
      <div className="side-window">
        <div className="chat-container">{/* Chat component */}</div>
      </div>
    </div>
  );
};

export default DashboardComponent;
