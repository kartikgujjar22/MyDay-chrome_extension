// my-react-extension/src/components/DailyTasks/TaskInput.jsx
import React, { useState } from 'react';
import './TaskInput.css'; // Create this CSS file

function TaskInput({ onAddTask }) {
  const [newTask, setNewTask] = useState('');

  const handleAdd = () => {
    if (newTask.trim()) {
      onAddTask(newTask);
      setNewTask('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="task-input-container">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Add a new task..."
      />
      <button onClick={handleAdd}>Add Task</button>
    </div>
  );
}

export default TaskInput;