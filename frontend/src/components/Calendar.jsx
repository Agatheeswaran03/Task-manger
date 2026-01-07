import { useState } from 'react';
import './Calendar.css';

const Calendar = ({ tasks, selectedMonth, selectedYear, onDateSelect, onMonthChange }) => {
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const getTasksForDate = (day) => {
    return tasks.filter((task) => {
      const taskDate = task.due_date ? new Date(task.due_date) : null;
      if (!taskDate) return false;

      const currentDate = new Date(selectedYear, selectedMonth, day);

      // Check for regular one-time tasks
      const isSameDay =
        taskDate.getDate() === day &&
        taskDate.getMonth() === selectedMonth &&
        taskDate.getFullYear() === selectedYear;

      if (isSameDay) return true;

      // Check for recurring tasks
      if (task.is_recurring && task.recurrence_pattern === 'daily') {
        const startDate = new Date(task.due_date);
        startDate.setHours(0, 0, 0, 0);

        let endDate = null;
        if (task.recurrence_end_date) {
          endDate = new Date(task.recurrence_end_date);
          endDate.setHours(23, 59, 59, 999);
        }

        return currentDate >= startDate && (!endDate || currentDate <= endDate);
      }

      return false;
    });
  };

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
  const days = [];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      onMonthChange(11, selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1, selectedYear);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      onMonthChange(0, selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1, selectedYear);
    }
  };

  const handleToday = () => {
    const today = new Date();
    onMonthChange(today.getMonth(), today.getFullYear());
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={handlePrevMonth}>
          ← Prev
        </button>
        <div className="calendar-month-year">
          <h2>{monthNames[selectedMonth]} {selectedYear}</h2>
        </div>
        <div className="calendar-actions">
          <button className="calendar-btn today-btn" onClick={handleToday}>
            Today
          </button>
          <button className="calendar-nav-btn" onClick={handleNextMonth}>
            Next →
          </button>
        </div>
      </div>

      <div className="calendar-weekdays">
        <div className="weekday">Sun</div>
        <div className="weekday">Mon</div>
        <div className="weekday">Tue</div>
        <div className="weekday">Wed</div>
        <div className="weekday">Thu</div>
        <div className="weekday">Fri</div>
        <div className="weekday">Sat</div>
      </div>

      <div className="calendar-grid">
        {days.map((day, index) => {
          const tasksForDay = day ? getTasksForDate(day) : [];
          const isToday =
            day &&
            day === new Date().getDate() &&
            selectedMonth === new Date().getMonth() &&
            selectedYear === new Date().getFullYear();

          return (
            <div
              key={index}
              className={`calendar-day ${day ? 'active' : 'empty'} ${isToday ? 'today' : ''}`}
              onClick={() => day && onDateSelect(day)}
            >
              {day && (
                <>
                  <div className="day-number">{day}</div>
                  <div className="day-tasks">
                    {tasksForDay.length > 0 && (
                      <div className="task-indicators">
                        {tasksForDay.slice(0, 3).map((task, i) => (
                          <div
                            key={i}
                            className={`task-dot ${task.status}`}
                            title={task.title}
                          />
                        ))}
                        {tasksForDay.length > 3 && (
                          <span className="task-count">+{tasksForDay.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-dot pending"></span>
          <span>Pending</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot in_progress"></span>
          <span>In Progress</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot completed"></span>
          <span>Completed</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot cancelled"></span>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
