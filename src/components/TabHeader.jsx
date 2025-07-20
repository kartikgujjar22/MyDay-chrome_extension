// my-react-extension/src/components/TabHeader.jsx
import React from 'react';
import './TabHeader.css'; // Create this CSS file

function TabHeader({ activeTab, setActiveTab }) {
  return (
    <div className="tab-header">
      <button
        className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
        onClick={() => setActiveTab('tasks')}
      >
        Daily Tasks
      </button>
      <button
        className={`tab-button ${activeTab === 'timer' ? 'active' : ''}`}
        onClick={() => setActiveTab('timer')}
      >
        Timer
      </button>
    </div>
  );
}

export default TabHeader;