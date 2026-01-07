import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './MonthlyAnalysis.css';

const MonthlyAnalysis = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        const response = await fetch(
          `${apiUrl}/tasks/analytics/?year=${selectedYear}&month=${selectedMonth + 1}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedMonth, selectedYear, user]);

  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
  };

  if (loading) {
    return (
      <div className="analysis-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analysis-container">
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="analysis-container">
        <div className="loading">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-container">
      <header className="analysis-header">
        <div className="header-content">
          <h1>📊 Monthly Analysis Dashboard</h1>
          <p>Track your productivity and task completion trends</p>
        </div>

        <div className="month-selector">
          <button onClick={() => handleMonthChange('prev')} className="nav-btn">
            ← Previous
          </button>
          <div className="current-month">
            <span className="month-display">
              {monthNames[selectedMonth]} {selectedYear}
            </span>
          </div>
          <button onClick={handleToday} className="today-btn">
            Today
          </button>
          <button onClick={() => handleMonthChange('next')} className="nav-btn">
            Next →
          </button>
        </div>
      </header>

      <div className="analytics-grid">
        {/* Key Metrics Row */}
        <div className="metrics-row">
          <div className="metric-card primary">
            <div className="metric-icon">📋</div>
            <div className="metric-content">
              <span className="metric-label">Total Tasks</span>
              <span className="metric-value">{analytics.total_tasks}</span>
            </div>
          </div>

          <div className="metric-card success">
            <div className="metric-icon">✅</div>
            <div className="metric-content">
              <span className="metric-label">Completed</span>
              <span className="metric-value">{analytics.completed_tasks}</span>
            </div>
          </div>

          <div className="metric-card warning">
            <div className="metric-icon">⏳</div>
            <div className="metric-content">
              <span className="metric-label">Pending</span>
              <span className="metric-value">{analytics.pending_tasks}</span>
            </div>
          </div>

          <div className="metric-card info">
            <div className="metric-icon">🔄</div>
            <div className="metric-content">
              <span className="metric-label">In Progress</span>
              <span className="metric-value">{analytics.in_progress_tasks}</span>
            </div>
          </div>

          <div className="metric-card accent">
            <div className="metric-icon">🎯</div>
            <div className="metric-content">
              <span className="metric-label">Completion Rate</span>
              <span className="metric-value">{analytics.completion_rate}%</span>
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="chart-card">
          <h2>Task Status Breakdown</h2>
          <div className="status-breakdown">
            <div className="status-bar-item">
              <div className="status-label">
                <span>Completed</span>
                <span className="status-count">{analytics.status_breakdown.completed}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill completed"
                  style={{
                    width: `${
                      analytics.total_tasks > 0
                        ? (analytics.status_breakdown.completed / analytics.total_tasks) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="status-bar-item">
              <div className="status-label">
                <span>In Progress</span>
                <span className="status-count">{analytics.status_breakdown.in_progress}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill in-progress"
                  style={{
                    width: `${
                      analytics.total_tasks > 0
                        ? (analytics.status_breakdown.in_progress / analytics.total_tasks) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="status-bar-item">
              <div className="status-label">
                <span>Pending</span>
                <span className="status-count">{analytics.status_breakdown.pending}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill pending"
                  style={{
                    width: `${
                      analytics.total_tasks > 0
                        ? (analytics.status_breakdown.pending / analytics.total_tasks) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="status-bar-item">
              <div className="status-label">
                <span>Cancelled</span>
                <span className="status-count">{analytics.status_breakdown.cancelled}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill cancelled"
                  style={{
                    width: `${
                      analytics.total_tasks > 0
                        ? (analytics.status_breakdown.cancelled / analytics.total_tasks) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="chart-card">
          <h2>Priority Distribution</h2>
          <div className="priority-grid">
            {Object.entries(analytics.priority_breakdown).map(([quadrant, count]) => {
              const quadrantNames = {
                Q1: { label: 'Urgent & Important', icon: '🔴', color: '#e74c3c' },
                Q2: { label: 'Not Urgent & Important', icon: '🟡', color: '#f39c12' },
                Q3: { label: 'Urgent & Not Important', icon: '🟢', color: '#3498db' },
                Q4: { label: 'Neither', icon: '⚪', color: '#95a5a6' },
              };

              const qInfo = quadrantNames[quadrant] || {};
              return (
                <div key={quadrant} className="priority-card">
                  <div className="priority-icon">{qInfo.icon}</div>
                  <div className="priority-info">
                    <span className="priority-label">{qInfo.label}</span>
                    <span className="priority-count">{count} tasks</span>
                  </div>
                  <div
                    className="priority-bar"
                    style={{
                      width: `${(count / analytics.total_tasks) * 100}%`,
                      backgroundColor: qInfo.color,
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Averages Row */}
        <div className="metrics-row">
          <div className="metric-card">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <span className="metric-label">Avg Urgency</span>
              <span className="metric-value">{analytics.avg_urgency.toFixed(1)}/4</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⭐</div>
            <div className="metric-content">
              <span className="metric-label">Avg Importance</span>
              <span className="metric-value">{analytics.avg_importance.toFixed(1)}/4</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📅</div>
            <div className="metric-content">
              <span className="metric-label">Days in Month</span>
              <span className="metric-value">{analytics.total_days_in_month}</span>
            </div>
          </div>
        </div>

        {/* Daily Activity Chart */}
        <div className="chart-card wide">
          <h2>Daily Task Activity</h2>
          <div className="daily-chart">
            {Object.entries(analytics.daily_counts).slice(0, 15).map(([date, count]) => (
              <div key={date} className="daily-bar-item">
                <div className="daily-bar-wrapper">
                  <div
                    className="daily-bar"
                    style={{
                      height: `${Math.max(20, (count / Math.max(...Object.values(analytics.daily_counts))) * 100)}px`,
                    }}
                    title={`${date}: ${count} tasks`}
                  ></div>
                </div>
                <span className="daily-date">{new Date(date).getDate()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="insights-card">
          <h2>📈 Monthly Insights</h2>
          <div className="insights-list">
            <div className="insight-item">
              <span className="insight-icon">✨</span>
              <div className="insight-content">
                <span className="insight-title">Completion Goal</span>
                <span className="insight-text">
                  You've completed {analytics.completed_tasks} out of {analytics.total_tasks} tasks
                  ({analytics.completion_rate}%)
                </span>
              </div>
            </div>

            {analytics.completion_rate >= 80 && (
              <div className="insight-item success">
                <span className="insight-icon">🎉</span>
                <div className="insight-content">
                  <span className="insight-title">Excellent Performance!</span>
                  <span className="insight-text">
                    You're maintaining an exceptional completion rate this month
                  </span>
                </div>
              </div>
            )}

            {analytics.pending_tasks > 0 && (
              <div className="insight-item warning">
                <span className="insight-icon">⚠️</span>
                <div className="insight-content">
                  <span className="insight-title">Pending Tasks</span>
                  <span className="insight-text">
                    You have {analytics.pending_tasks} pending task{analytics.pending_tasks !== 1 ? 's' : ''} to complete
                  </span>
                </div>
              </div>
            )}

            <div className="insight-item">
              <span className="insight-icon">🎯</span>
              <div className="insight-content">
                <span className="insight-title">Priority Focus</span>
                <span className="insight-text">
                  {analytics.priority_breakdown.Q1 > 0
                    ? `You have ${analytics.priority_breakdown.Q1} high-priority tasks`
                    : 'No high-priority tasks this month'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyAnalysis;
