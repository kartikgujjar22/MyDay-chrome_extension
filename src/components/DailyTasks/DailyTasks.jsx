// my-react-extension/src/components/DailyTasks/DailyTasks.jsx
import React, { useState, useEffect } from 'react';
import TaskInput from './TaskInput';
import TaskList from './TaskList';
import './DailyTasks.css'; // Create this CSS file

function DailyTasks() {
  const [tasks, setTasks] = useState([]);

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
  const handleAddTask = async (taskText) => {
    if (taskText.trim() === '') return;
    const task = { id: Date.now(), text: taskText.trim(), completed: false };
    if (chrome.runtime) {
      try {
        const response = await chrome.runtime.sendMessage({ action: "addTask", task });
        setTasks(response.tasks);
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
    if (window.confirm("Are you sure you want to clear all tasks for today?")) {
      if (chrome.runtime) {
        try {
          const response = await chrome.runtime.sendMessage({ action: "clearAllTasks" });
          setTasks(response.tasks);
        } catch (error) {
          console.error("Error clearing tasks:", error);
        }
      }
    }
  };

  return (
    <div className="daily-tasks-container tab-content">
      <h2>Daily Tasks</h2>
      <TaskInput onAddTask={handleAddTask} />
      <TaskList tasks={tasks} onDeleteTask={handleDeleteTask} />
      {tasks.length > 0 && (
        <button onClick={handleClearAllTasks} className="clear-all-button">
          Clear All Tasks
        </button>
      )}
    </div>
  );
}

export default DailyTasks;