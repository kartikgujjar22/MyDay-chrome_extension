// my-react-extension/src/components/DailyTasks/TaskList.jsx
import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css'; // Create this CSS file

function TaskList({ tasks, onDeleteTask }) {
  if (tasks.length === 0) {
    return <p className="no-tasks-message">No tasks for today! Add some.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDeleteTask={onDeleteTask} />
      ))}
    </ul>
  );
}

export default TaskList;