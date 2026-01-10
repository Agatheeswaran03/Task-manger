import { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import Calendar from '../components/Calendar';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import {
  Calendar as CalendarIcon,
  Map,
  Plus,
  X,
  CheckCircle2,
  ListTodo,
  PieChart,
  Repeat,
  CalendarDays,
  Target,
  BarChart3,
  MousePointerClick
} from 'lucide-react';
import './MonthTracker.css';

const MonthTracker = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [monthTasks, setMonthTasks] = useState([]);
  const [dayTasks, setDayTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [recurringMode, setRecurringMode] = useState(false);

  const { tasks, createTask, updateTask, deleteTask } = useTasks();

  // Get monthly tasks for the selected month (excluding daily-only tasks)
  useEffect(() => {
    const filtered = tasks.filter((task) => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);

      const monthStart = new Date(selectedYear, selectedMonth, 1);
      const monthEnd = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59, 999);

      // Monthly recurring task active in this month
      if (task.task_type === 'monthly' && task.is_recurring) {
        const startDate = new Date(task.due_date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = task.recurrence_end_date ? new Date(task.recurrence_end_date) : null;
        if (endDate) endDate.setHours(23, 59, 59, 999);

        return startDate <= monthEnd && (!endDate || endDate >= monthStart);
      }

      // One-time monthly task in this month
      return (
        taskDate.getMonth() === selectedMonth &&
        taskDate.getFullYear() === selectedYear &&
        task.task_type !== 'daily'
      );
    });
    setMonthTasks(filtered);
  }, [tasks, selectedMonth, selectedYear]);

  // Get tasks for selected day
  useEffect(() => {
    if (!selectedDay) {
      setDayTasks([]);
      return;
    }

    const filtered = monthTasks.filter((task) => {
      const taskDate = new Date(task.due_date);
      taskDate.setHours(0, 0, 0, 0);

      const currentSelectedDate = new Date(selectedYear, selectedMonth, selectedDay);
      currentSelectedDate.setHours(0, 0, 0, 0);

      // If recurring, check if selected day is within range
      if (task.is_recurring) {
        const endDate = task.recurrence_end_date ? new Date(task.recurrence_end_date) : null;
        if (endDate) endDate.setHours(23, 59, 59, 999);
        return currentSelectedDate >= taskDate && (!endDate || currentSelectedDate <= endDate);
      }

      // If not recurring, check for exact date match
      return (
        taskDate.getDate() === selectedDay &&
        taskDate.getMonth() === selectedMonth &&
        taskDate.getFullYear() === selectedYear
      );
    });

    filtered.sort((a, b) => {
      const statusOrder = { 'in_progress': 0, 'pending': 1, 'completed': 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

    setDayTasks(filtered);
  }, [selectedDay, monthTasks]);

  const handleCreateTask = async (taskData) => {
    try {

      // Calculate start and end dates for the recurring task
      const startDate = new Date(selectedYear, selectedMonth, 1);
      const endDate = new Date(selectedYear, selectedMonth + 1, 0); // Last day of month

      let isMonthlyGoal = !selectedDay;
      let dueDate;

      if (selectedDay) {
        dueDate = new Date(selectedYear, selectedMonth, selectedDay);
      } else {
        dueDate = startDate;
      }
      dueDate.setHours(12, 0, 0, 0);

      await createTask.mutateAsync({
        ...taskData,
        task_type: 'monthly',
        due_date: dueDate.toISOString(),
        // Check for either implicit monthly goal OR explicit recurring checkbox
        is_recurring: isMonthlyGoal || recurringMode,
        // Both cases effectively imply daily recurrence for the month context
        recurrence_pattern: (isMonthlyGoal || recurringMode) ? 'daily' : null,
        recurrence_days: [],
        // Always end at the end of the current month for this feature
        recurrence_end_date: (isMonthlyGoal || recurringMode) ? endDate.toISOString() : null,
      });
      setShowForm(false);
      setRecurringMode(false);
    } catch (error) {
      console.error('Error creating task:', error);
      alert(`Error happened: ${JSON.stringify(error.response?.data || error.message)}`);
    }
  };

  const handleMonthChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setSelectedDay(null);
  };

  const handleDateSelect = (day) => {
    setSelectedDay(selectedDay === day ? null : day);
  };

  const getMonthName = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[selectedMonth];
  };

  const completionRate = monthTasks.length > 0
    ? Math.round((monthTasks.filter(t => t.status === 'completed').length / monthTasks.length) * 100)
    : 0;

  return (
    <div className="month-tracker-container">
      <header className="tracker-header">
        <div className="tracker-title">
          <h1><CalendarDays className="w-8 h-8" /> Month Tracker</h1>
          <p><Map className="w-4 h-4" /> {getMonthName()} {selectedYear}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="add-month-btn"
        >
          {showForm ? <><X size={20} /> Cancel</> : <><Plus size={20} /> {selectedDay ? 'Add Task for Day' : 'Add Monthly Goal'}</>}
        </button>
      </header>

      <div className="month-stats-bar">
        <div className="stat-item">
          <div className="stat-header-flex">
            <span className="stat-name">Total Tasks</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db' }}>
              <ListTodo size={20} />
            </div>
          </div>
          <span className="stat-value">{monthTasks.length}</span>
        </div>
        <div className="stat-item">
          <div className="stat-header-flex">
            <span className="stat-name">Completed</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <span className="stat-value">{monthTasks.filter(t => t.status === 'completed').length}</span>
        </div>
        <div className="stat-item">
          <div className="stat-header-flex">
            <span className="stat-name">Completion</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6' }}>
              <PieChart size={20} />
            </div>
          </div>
          <span className="stat-value">{completionRate}%</span>
        </div>
        <div className="stat-item">
          <div className="stat-header-flex">
            <span className="stat-name">Recurring</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(230, 126, 34, 0.1)', color: '#e67e22' }}>
              <Repeat size={20} />
            </div>
          </div>
          <span className="stat-value">{monthTasks.filter(t => t.is_recurring).length}</span>
        </div>
      </div>

      <div className="tracker-content">
        <div className="calendar-section">
          <Calendar
            tasks={monthTasks}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onDateSelect={handleDateSelect}
            onMonthChange={handleMonthChange}
          />
        </div>

        <div className="details-section">
          {showForm && (
            <div className="form-container">
              <div className="form-header">
                <h3>
                  {selectedDay
                    ? <><CalendarIcon size={20} /> Add Task for {getMonthName()} {selectedDay}</>
                    : <><Target size={20} /> Add Monthly Goal</>}
                </h3>
                <label className="recurring-toggle">
                  <input
                    type="checkbox"
                    checked={recurringMode}
                    onChange={(e) => setRecurringMode(e.target.checked)}
                  />
                  <span>Make it Recurring</span>
                </label>
              </div>
              <TaskForm
                onSubmit={handleCreateTask}
                onCancel={() => {
                  setShowForm(false);
                  setRecurringMode(false);
                }}
                showRecurringFields={recurringMode}
              />
            </div>
          )}

          {selectedDay && (
            <div className="day-details">
              <div className="day-header">
                <h3>
                  <CalendarDays size={20} /> {getMonthName()} {selectedDay}, {selectedYear}
                </h3>
                <span className="task-count">{dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}</span>
              </div>

              {dayTasks.length === 0 ? (
                <div className="no-tasks">
                  <MousePointerClick size={40} style={{ opacity: 0.3 }} />
                  <p>No tasks scheduled for this day</p>
                </div>
              ) : (
                <div className="day-tasks-list">
                  {dayTasks.map((task) => {
                    // Check completion for this specific day
                    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

                    // effectiveStatus logic:
                    // 1. If recurring: check if date is in completed_dates
                    // 2. If not recurring: use global status
                    const isCompletedToday = task.is_recurring && task.completed_dates?.includes(dateStr);
                    const effectiveStatus = task.is_recurring
                      ? (isCompletedToday ? 'completed' : 'pending')
                      : task.status;

                    // Create a display task object
                    const displayTask = {
                      ...task,
                      status: effectiveStatus
                    };

                    return (
                      <div key={task.id} className="month-task-item">
                        <TaskItem
                          task={displayTask}
                          onUpdate={(id, data) => {
                            // Inject completion_date for recurring tasks
                            if (task.is_recurring) {
                              data.completion_date = dateStr;
                            }
                            updateTask.mutate({ id, data });
                          }}
                          onDelete={(id) => deleteTask.mutate(id)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {!selectedDay && !showForm && (
            <div className="month-summary">
              <h3 className="summary-heading"><BarChart3 size={20} /> Month Overview</h3>
              <div className="summary-content">
                <p>Select a day from the calendar to view or add tasks for that specific day, or use "Add Monthly Goal" to create tasks for the whole month.</p>
                <div className="quick-stats">
                  <div className="quick-stat">
                    <span className="label">High Priority</span>
                    <span className="value">
                      {monthTasks.filter(t => t.priority_quadrant === 'Q1').length}
                    </span>
                  </div>
                  <div className="quick-stat">
                    <span className="label">Pending</span>
                    <span className="value">
                      {monthTasks.filter(t => t.status === 'pending').length}
                    </span>
                  </div>
                  <div className="quick-stat">
                    <span className="label">In Progress</span>
                    <span className="value">
                      {monthTasks.filter(t => t.status === 'in_progress').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthTracker;
