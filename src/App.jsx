// my-react-extension/src/App.jsx
import React, { useState } from 'react';
import './App.css';
import TabHeader from './components/TabHeader';
import DailyTasks from './components/DailyTasks/DailyTasks';
import Timer from './components/Timer/Timer';

function App() {
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'timer'

  return (
    <div className="App">
      <TabHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="tab-body">
        {activeTab === 'tasks' && <DailyTasks />}
        {activeTab === 'timer' && <Timer />}
      </div>
    </div>
  );
}

export default App;