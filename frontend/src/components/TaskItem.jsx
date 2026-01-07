import { useState } from 'react';
import PriorityBadge from './PriorityBadge';
import './TaskItem.css';

const TaskItem = ({ task, onUpdate, onDelete, onReanalyze }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');

  const handleStatusChange = (newStatus) => {
    // If status is cancelled, delete the task
    if (newStatus === 'cancelled') {
      onDelete(task.id);
    } else {
      // Update immediately for instant feedback
      onUpdate(task.id, { status: newStatus });
    }
  };

  const handleSave = () => {
    onUpdate(task.id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description || '');
    setIsEditing(false);
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      pending: '⏳',
      in_progress: '⚙️',
      completed: '✅',
      cancelled: '❌',
    };
    return emojis[status] || '⏳';
  };

  return (
    <div className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}>
      <div className="task-header">
        {isEditing ? (
          <div className="task-edit-form">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="edit-input"
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="edit-textarea"
              rows="3"
            />
            <div className="edit-actions">
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={handleCancel} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="task-title-row">
              <h3 className="task-title">{task.title}</h3>
              <PriorityBadge quadrant={task.priority_quadrant} />
            </div>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
          </>
        )}
      </div>

      <div className="task-actions">
        <div className="action-buttons">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="status-select-compact"
            title={task.status}
          >
            <option value="pending">⏳</option>
            <option value="in_progress">⚙️</option>
            <option value="completed">✅</option>
            <option value="cancelled">❌</option>
          </select>

          {!isEditing && (
            <>
              <button onClick={() => setIsEditing(true)} className="icon-btn" title="Edit">
                ✏️
              </button>
              <button onClick={() => onDelete(task.id)} className="icon-btn delete-btn" title="Delete">
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;

