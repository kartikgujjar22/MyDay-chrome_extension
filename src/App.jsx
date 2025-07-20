import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Assuming you have an App.css for basic styling

// Daily Tasks Component
function DailyTasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Function to fetch tasks from background script
  const fetchTasks = async () => {
    if (chrome.runtime) {
      try {
        const response = await chrome.runtime.sendMessage({ action: "getTasks" });
        setTasks(response.tasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a new task
  const handleAddTask = async () => {
    if (newTask.trim() === '') return; // Don't add empty tasks
    const task = { id: Date.now(), text: newTask.trim(), completed: false }; // Unique ID for task
    if (chrome.runtime) {
      try {
        const response = await chrome.runtime.sendMessage({ action: "addTask", task });
        setTasks(response.tasks);
        setNewTask('');
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    if (chrome.runtime) {
      try {
        const response = await chrome.runtime.sendMessage({ action: "deleteTask", taskId });
        setTasks(response.tasks);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  // Clear all tasks (for testing or manual clear)
  const handleClearAllTasks = async () => {
    if (chrome.runtime) {
      try {
        const response = await chrome.runtime.sendMessage({ action: "clearAllTasks" });
        setTasks(response.tasks);
      } catch (error) {
        console.error("Error clearing tasks:", error);
      }
    }
  };

  return (
    <div className="tab-content">
      <h2>Daily Tasks</h2>
      <div className="task-input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          onKeyPress={(e) => { if (e.key === 'Enter') handleAddTask(); }}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      {tasks.length === 0 ? (
        <p>No tasks for today! Add some.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id}>
              <span>{task.text}</span>
              <button onClick={() => handleDeleteTask(task.id)} className="delete-button">
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleClearAllTasks} className="clear-all-button">Clear All Tasks</button>
    </div>
  );
}

// Timer Component
function Timer() {
  const [time, setTime] = useState(0); // Time in seconds
  const [inputMinutes, setInputMinutes] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null); // To store the interval ID

  useEffect(() => {
    if (isRunning && time > 0) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      // Optionally, play a sound or show a notification when timer finishes
    }
    return () => clearInterval(timerRef.current); // Cleanup on unmount or re-render
  }, [isRunning, time]);

  const handleStart = () => {
    if (time === 0 && inputMinutes > 0) {
      setTime(parseInt(inputMinutes) * 60);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setTime(0);
    setInputMinutes('');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="tab-content">
      <h2>Timer</h2>
      <div className="timer-display">{formatTime(time)}</div>
      <div className="timer-controls">
        <input
          type="number"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(e.target.value)}
          placeholder="Minutes"
          min="0"
        />
        <button onClick={handleStart} disabled={isRunning || (time === 0 && inputMinutes === '')}>
          {time > 0 && !isRunning ? 'Resume' : 'Start'}
        </button>
        <button onClick={handlePause} disabled={!isRunning}>Pause</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'timer'

  return (
    <div className="App">
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

      <div className="tab-body">
        {activeTab === 'tasks' && <DailyTasks />}
        {activeTab === 'timer' && <Timer />}
      </div>
    </div>
  );
}

export default App;