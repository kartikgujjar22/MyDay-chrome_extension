// my-react-extension/src/components/DailyTasks/TaskItem.jsx
import React from 'react';
import './TaskItem.css'; // Create this CSS file

function TaskItem({ task, onDeleteTask }) {
  return (
    <li className="task-item">
      <span>{task.text}</span>
      <button onClick={() => onDeleteTask(task.id)} className="delete-button">
        &times;
      </button>
    </li>
  );
}

export default TaskItem;