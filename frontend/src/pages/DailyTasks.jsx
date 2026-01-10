import { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import {
  Calendar,
  Plus,
  X,
  CheckCircle2,
  Clock,
  Loader2,
  ListTodo,
  Lightbulb,
  PartyPopper
} from 'lucide-react';
import './DailyTasks.css';

const DailyTasks = () => {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { tasks, createTask, updateTask, deleteTask } = useTasks();

  useEffect(() => {
    // Filter tasks for today that are marked as "daily" type
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filtered = tasks.filter((task) => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      taskDate.setHours(0, 0, 0, 0);

      const isToday = taskDate.getTime() === today.getTime();

      // Show if it's a daily task due today
      if (task.task_type === 'daily' && isToday) return true;

      // Show if it's a monthly recurring task active today
      if (task.task_type === 'monthly' && task.is_recurring) {
        const endDate = task.recurrence_end_date ? new Date(task.recurrence_end_date) : null;
        if (endDate) endDate.setHours(23, 59, 59, 999);

        // Active if today is between start (due_date) and end
        return today >= taskDate && (!endDate || today <= endDate);
      }

      return false;
    });

    // Sort by status priority
    const statusOrder = { 'in_progress': 0, 'pending': 1, 'completed': 2, 'cancelled': 3 };
    filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

    setDailyTasks(filtered);
  }, [tasks]);

  const getTaskStats = () => {
    const stats = {
      total: dailyTasks.length,
      completed: dailyTasks.filter(t => t.status === 'completed').length,
      pending: dailyTasks.filter(t => t.status === 'pending').length,
      inProgress: dailyTasks.filter(t => t.status === 'in_progress').length,
    };
    return stats;
  };

  const handleCreateTask = async (taskData) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await createTask.mutateAsync({
        ...taskData,
        task_type: 'daily',  // Mark as daily-only task
        due_date: today.toISOString(),
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to create task';
      alert(`Error happened: ${JSON.stringify(error.response?.data || error.message)}`);
    }
  };

  const handleUpdateTask = async (id, data) => {
    updateTask.mutate({ id, data });
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await deleteTask.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  const stats = getTaskStats();
  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="daily-tasks-container">
      <header className="daily-header">
        <div className="daily-title">
          <h1><Calendar className="w-8 h-8" /> Today's Tasks</h1>
          <p className="date-display">{today}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="add-daily-btn"
        >
          {showForm ? <><X size={20} /> Cancel</> : <><Plus size={20} /> Add Task</>}
        </button>
      </header>

      {stats.total > 0 && (
        <div className="daily-progress-section">
          <div className="progress-header">
            <span>Daily Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      <div className="daily-stats">
        <div className="stat-card total">
          <div className="stat-icon-wrapper">
            <ListTodo size={24} />
          </div>
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon-wrapper">
            <Clock size={24} />
          </div>
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card in-progress">
          <div className="stat-icon-wrapper">
            <Loader2 size={24} className="animate-spin" />
          </div>
          <span className="stat-number">{stats.inProgress}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-card completed">
          <div className="stat-icon-wrapper">
            <CheckCircle2 size={24} />
          </div>
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {showForm && (
        <div className="form-section">
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="daily-tasks-list">
        {dailyTasks.length === 0 ? (
          <div className="empty-state">
            <PartyPopper size={60} />
            <h2>No tasks for today!</h2>
            <p>You're all caught up. Great job! 🎉</p>
          </div>
        ) : (
          <div className="tasks-by-status">
            {['in_progress', 'pending', 'completed'].map((status) => {
              const statusTasks = dailyTasks.filter(t => t.status === status);
              if (statusTasks.length === 0) return null;

              const statusConfig = {
                in_progress: { label: 'In Progress', icon: <Loader2 size={20} className="animate-spin" /> },
                pending: { label: 'Pending', icon: <Clock size={20} /> },
                completed: { label: 'Completed', icon: <CheckCircle2 size={20} /> },
              };

              return (
                <div key={status} className="status-group">
                  <h3 className="status-header">
                    {statusConfig[status].icon}
                    {statusConfig[status].label}
                  </h3>
                  <div className="tasks-group">
                    {statusTasks.map((task) => (
                      <div key={task.id} className="daily-task-item">
                        <TaskItem
                          task={task}
                          onUpdate={handleUpdateTask}
                          onDelete={handleDeleteTask}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="daily-tips">
        <Lightbulb size={24} />
        <p><strong>Tip:</strong> Focus on high-priority tasks first. Break down large tasks into smaller steps for better progress.</p>
      </div>
    </div>
  );
};

export default DailyTasks;
