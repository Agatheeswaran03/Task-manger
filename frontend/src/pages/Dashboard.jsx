import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';
import ThemeToggle from '../components/ThemeToggle';
import DailyTasks from './DailyTasks';
import MonthTracker from './MonthTracker';
import MonthlyAnalysis from './MonthlyAnalysis';
import './Dashboard.css';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('daily'); // 'daily', 'month', 'analysis'
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Connect WebSocket for real-time updates
  useWebSocket(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">Agathees</h1>
            <p className="app-subtitle">AI-Powered Task Manager</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="username">Welcome, {user?.username || 'User'}!</span>
            </div>
            <ThemeToggle />
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeView === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveView('daily')}
          >
            📅 Today
          </button>
          <button
            className={`nav-tab ${activeView === 'month' ? 'active' : ''}`}
            onClick={() => setActiveView('month')}
          >
            🗓️ Month Tracker
          </button>
          <button
            className={`nav-tab ${activeView === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveView('analysis')}
          >
            📊 Analytics
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-content">
          {activeView === 'daily' && <DailyTasks />}
          {activeView === 'month' && <MonthTracker />}
          {activeView === 'analysis' && <MonthlyAnalysis />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

