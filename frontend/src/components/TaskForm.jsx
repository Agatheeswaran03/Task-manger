import { useState } from 'react';
import './TaskForm.css';

const TaskForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [urgency, setUrgency] = useState(initialData?.urgency || 2);
  const [importance, setImportance] = useState(initialData?.importance || 2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        urgency,
        importance,
      });
      setTitle('');
      setDescription('');
      setUrgency(2);
      setImportance(2);
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Task Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description (AI will analyze this)</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your task in natural language. AI will determine urgency and importance..."
          rows="4"
          disabled={isSubmitting}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Urgency Level</label>
          <div className="level-selector">
            {[1, 2, 3, 4].map((level) => (
              <button
                key={level}
                type="button"
                className={`level-btn ${urgency === level ? 'active' : ''}`}
                onClick={() => setUrgency(level)}
                disabled={isSubmitting}
                style={{
                  backgroundColor: urgency === level ? `hsl(${(5-level)*60}, 70%, 50%)` : '#f0f0f0'
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Importance Level</label>
          <div className="level-selector">
            {[1, 2, 3, 4].map((level) => (
              <button
                key={level}
                type="button"
                className={`level-btn ${importance === level ? 'active' : ''}`}
                onClick={() => setImportance(level)}
                disabled={isSubmitting}
                style={{
                  backgroundColor: importance === level ? `hsl(${(5-level)*60}, 70%, 50%)` : '#f0f0f0'
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        )}
        <button type="submit" disabled={isSubmitting || !title.trim()}>
          {isSubmitting ? 'Creating...' : initialData ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;

