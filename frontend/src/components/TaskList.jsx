import { useState } from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ tasks, onUpdate, onDelete, onReanalyze, isLoading }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  // Ensure tasks is always an array
  const tasksArray = Array.isArray(tasks) ? tasks : [];

  const filteredTasks = tasksArray.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'active') return task.status !== 'completed' && task.status !== 'cancelled';
    return task.status === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      return b.priority_score - a.priority_score;
    }
    if (sortBy === 'date') {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const groupedTasks = {
    Q1: sortedTasks.filter((t) => t.priority_quadrant === 'Q1'),
    Q2: sortedTasks.filter((t) => t.priority_quadrant === 'Q2'),
    Q3: sortedTasks.filter((t) => t.priority_quadrant === 'Q3'),
    Q4: sortedTasks.filter((t) => t.priority_quadrant === 'Q4'),
  };

  if (isLoading) {
    return (
      <div className="task-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasksArray.length === 0) {
    return (
      <div className="task-list-empty">
        <p>No tasks yet. Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-list-controls">
        <div className="filter-controls">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="priority">Priority</option>
            <option value="date">Date Created</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      <div className="task-list-content">
        {sortedTasks.length === 0 ? (
          <div className="task-list-empty">
            <p>No tasks match your filter.</p>
          </div>
        ) : (
          <>
            {groupedTasks.Q1.length > 0 && (
              <div className="task-quadrant">
                <h2 className="quadrant-title q1">Q1: Do First</h2>
                {groupedTasks.Q1.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onReanalyze={onReanalyze}
                  />
                ))}
              </div>
            )}
            {groupedTasks.Q2.length > 0 && (
              <div className="task-quadrant">
                <h2 className="quadrant-title q2">Q2: Schedule</h2>
                {groupedTasks.Q2.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onReanalyze={onReanalyze}
                  />
                ))}
              </div>
            )}
            {groupedTasks.Q3.length > 0 && (
              <div className="task-quadrant">
                <h2 className="quadrant-title q3">Q3: Delegate</h2>
                {groupedTasks.Q3.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onReanalyze={onReanalyze}
                  />
                ))}
              </div>
            )}
            {groupedTasks.Q4.length > 0 && (
              <div className="task-quadrant">
                <h2 className="quadrant-title q4">Q4: Eliminate</h2>
                {groupedTasks.Q4.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onReanalyze={onReanalyze}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskList;

