# Quick Reference Guide

## ✨ Daily vs Monthly Tasks (Latest Update)

| Feature | Daily Task | Monthly Task |
|---------|-----------|--------------|
| **Created in** | "Today's Tasks" tab | "Month Tracker" tab |
| **Shows in** | Today only | Entire month |
| **In Analytics** | ❌ No | ✅ Yes |
| **Affects Completion %** | ❌ No | ✅ Yes |
| **Recurring** | ⚠️ Not recommended | ✅ Full support |
| **Best for** | Quick one-off items | Planned monthly work |

### Create Daily Task
```
Today's Tasks → + Add Task → Submit
↓ Automatically marked as task_type='daily'
↓ Only shows today
```

### Create Monthly Task
```
Month Tracker → + Add Task → Due date → Submit
↓ Automatically marked as task_type='monthly'
↓ Shows on calendar, included in analytics
```

### View Analytics
```
Monthly Analysis → Use arrows to change month
↓ Shows stats for monthly tasks only
↓ Daily tasks excluded from all metrics
```

---

## 📍 New Files Created

### Frontend Components
```
frontend/src/components/
├── Calendar.jsx (NEW)
└── Calendar.css (NEW)

frontend/src/pages/
├── DailyTasks.jsx (NEW)
├── DailyTasks.css (NEW)
├── MonthTracker.jsx (NEW)
├── MonthTracker.css (NEW)
├── MonthlyAnalysis.jsx (NEW)
└── MonthlyAnalysis.css (NEW)
```

### Documentation
```
├── IMPLEMENTATION_SUMMARY.md (NEW)
├── SETUP_TESTING_GUIDE.md (NEW)
├── API_DOCUMENTATION.md (NEW)
├── QUICK_REFERENCE.md (THIS FILE)
├── TASK_TYPES_DOCUMENTATION.md (NEW - Daily vs Monthly)
├── TESTING_GUIDE_TASK_TYPES.md (NEW - Testing guide)
├── IMPLEMENTATION_CHANGES.md (NEW - Technical details)
└── DAILY_VS_MONTHLY_SUMMARY.md (NEW - Complete overview)
```

---

## 🔄 Modified Files

### Backend
```
backend/tasks/
├── models.py (Added task_type field + recurring fields)
├── serializers.py (Added task_type serialization)
└── views.py (Updated 3 endpoints for filtering)

backend/config/
└── settings.py (Added localhost:5174 to CORS)
```

### Frontend
```
frontend/src/pages/
├── Dashboard.jsx (Added navigation tabs)
├── DailyTasks.jsx (Filters task_type='daily')
└── MonthTracker.jsx (Filters task_type='monthly')
```

---

## ⚡ Quick Start

### 1. Install & Run Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py runserver
```

### 2. Install & Run Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Login & Test
- Open http://localhost:5173
- Login with your credentials
- Click tabs to navigate: **All Tasks** | **Today** | **Month Tracker** | **Analytics**

---

## 📋 New Features Checklist

- [ ] Daily Tasks View (`📅 Today` tab)
- [ ] Interactive Calendar (in Month Tracker)
- [ ] Month Tracker with day-wise view (`🗓️ Month Tracker` tab)
- [ ] Recurring Tasks support
- [ ] Monthly Analytics Dashboard (`📊 Analytics` tab)
- [ ] Task creation with due dates
- [ ] Task filtering by date
- [ ] Completion statistics
- [ ] Priority distribution charts
- [ ] Daily activity tracking

---

## 🎯 Main Components

### Calendar Component
- **File**: `components/Calendar.jsx`
- **Usage**: Displays interactive monthly calendar
- **Features**: 
  - Task indicators by status
  - Date navigation
  - Click to select day
  - Mobile responsive

### Daily Tasks View
- **File**: `pages/DailyTasks.jsx`
- **Usage**: Show today's tasks only
- **Features**:
  - Real-time statistics
  - Status grouping
  - Quick task addition
  - Empty state message

### Month Tracker
- **File**: `pages/MonthTracker.jsx`
- **Usage**: Complete monthly overview
- **Features**:
  - Calendar + details panel
  - Day-wise task management
  - Recurring task creation
  - Month statistics

### Monthly Analysis
- **File**: `pages/MonthlyAnalysis.jsx`
- **Usage**: Analytics and insights
- **Features**:
  - Multiple charts
  - Statistics cards
  - Daily trends
  - AI insights

---

## 🔌 New API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/tasks/daily_tasks/` | GET | Get today's tasks |
| `/api/tasks/monthly_tasks/` | GET | Get month's tasks |
| `/api/tasks/analytics/` | GET | Get analytics data |

### Query Parameters
```
monthly_tasks/?year=2026&month=1
analytics/?year=2026&month=1
```

---

## 🎨 Color Scheme

| Status | Color | Hex |
|--------|-------|-----|
| Pending | Orange | #f39c12 |
| In Progress | Blue | #3498db |
| Completed | Green | #27ae60 |
| Cancelled | Gray | #95a5a6 |
| Q1 (High/High) | Red | #e74c3c |
| Q2 (Low/High) | Orange | #f39c12 |
| Q3 (High/Low) | Green | #3498db |
| Q4 (Low/Low) | Gray | #95a5a6 |

---

## 📱 Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Mobile | < 768px | Single column |
| Tablet | 768-1024px | 2 columns |
| Desktop | 1024px+ | Full layout |

---

## 🔑 Key Props & Parameters

### Calendar Component
```javascript
<Calendar
  tasks={tasks}
  selectedMonth={month}
  selectedYear={year}
  onDateSelect={handleDateSelect}
  onMonthChange={handleMonthChange}
/>
```

### TaskForm (with recurring support)
```javascript
<TaskForm
  onSubmit={handleCreateTask}
  onCancel={handleCancel}
  showRecurringFields={true}
/>
```

---

## 🚀 Common Tasks

### Create Recurring Task
1. Open Month Tracker
2. Click "+ Add Task"
3. Enable "Make it Recurring"
4. Select Daily/Weekly/Monthly
5. Set recurrence end date
6. Submit form

### View Analytics
1. Click "📊 Analytics" tab
2. Navigate months with < >
3. Or click "Today" to go to current month
4. Review statistics and charts

### Manage Daily Tasks
1. Click "📅 Today" tab
2. View statistics bar
3. Tasks grouped by status
4. Update status by clicking
5. Delete unwanted tasks

### Track Monthly Progress
1. Click "🗓️ Month Tracker" tab
2. Browse calendar
3. Click dates to see details
4. Create tasks for specific days
5. Monitor completion rate

---

## 🔍 Debugging Tips

### Check Console Errors
```javascript
// Open browser console (F12)
// Look for any red error messages
```

### Verify API Calls
```javascript
// Network tab in DevTools
// Filter by XHR/Fetch
// Check request and response
```

### Test API Endpoint
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/tasks/daily_tasks/
```

### View Component State
```javascript
// Add to components
console.log('Current State:', state);
console.log('Props:', props);
```

---

## 📊 Data Flow

```
User Action
    ↓
Component (React)
    ↓
API Call (REST)
    ↓
Backend (Django)
    ↓
Database (MongoDB)
    ↓
Response (JSON)
    ↓
Component Update (Re-render)
    ↓
UI Update (Browser)
```

---

## 🛠️ Common Issues & Quick Fixes

| Issue | Fix |
|-------|-----|
| Tasks not loading | Check API endpoint, verify auth token |
| Calendar empty | Ensure tasks have `due_date` set |
| Analytics no data | Create tasks, check date range |
| Styles broken | Clear cache, restart dev server |
| Recurring not working | Check `is_recurring`, `recurrence_pattern` |

---

## 📈 Performance Tips

1. **Lazy Load Components**: Import components on demand
2. **Memoize Expensive Renders**: Use `React.memo()` for large lists
3. **Optimize Queries**: Add pagination for large datasets
4. **Cache API Responses**: Store in state/context
5. **Debounce Searches**: Reduce API calls while typing

---

## 🎓 Learning Resources

- React Hooks: https://react.dev/reference/react
- Django REST: https://www.django-rest-framework.org/
- MongoDB: https://docs.mongodb.com/
- Responsive Design: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design

---

## 📞 Support Checklist

Before reporting issues:
- [ ] Backend running on port 8000?
- [ ] Frontend running on port 5173?
- [ ] MongoDB connected?
- [ ] User authenticated?
- [ ] Browser cache cleared?
- [ ] No console errors?
- [ ] API endpoint accessible?
- [ ] Proper parameters passed?

---

## 🔐 Security Notes

1. **Authentication**: Always include Bearer token
2. **CORS**: Ensure frontend/backend URLs match
3. **Tokens**: Store securely (localStorage for now)
4. **User Data**: Tasks are user-specific
5. **Validation**: All inputs validated on backend

---

## 📝 File Locations Quick Reference

| Component | Frontend Path | Backend Path |
|-----------|---------------|--------------|
| Calendar | `components/Calendar.jsx` | N/A |
| Daily View | `pages/DailyTasks.jsx` | N/A |
| Month Tracker | `pages/MonthTracker.jsx` | N/A |
| Analytics | `pages/MonthlyAnalysis.jsx` | N/A |
| Dashboard | `pages/Dashboard.jsx` | N/A |
| Models | N/A | `tasks/models.py` |
| Serializers | N/A | `tasks/serializers.py` |
| Views | N/A | `tasks/views.py` |

---

## 🎉 What's Included

✅ **Daily Management** - Focus on today's tasks
✅ **Monthly Planning** - Plan entire months
✅ **Visual Calendar** - See tasks at a glance
✅ **Recurring Tasks** - Automate repetitive work
✅ **Analytics** - Understand your productivity
✅ **Responsive Design** - Works on all devices
✅ **Beautiful UI** - Modern and intuitive
✅ **Real-time Updates** - Instant feedback
✅ **Full Documentation** - Complete guides

---

## 🚀 Next Steps

1. **Test Features** - Try all new components
2. **Create Tasks** - Add tasks with dates
3. **Review Analytics** - Check your patterns
4. **Optimize Workflow** - Use insights for improvement
5. **Plan Ahead** - Schedule future tasks
6. **Track Progress** - Monitor completion rates

---

## 📱 Mobile Optimization

- ✅ Responsive grid layouts
- ✅ Touch-friendly buttons (min 44px)
- ✅ Readable font sizes
- ✅ Proper spacing
- ✅ Scrollable content
- ✅ Optimized images
- ✅ Fast load times

---

## 🎯 Success Criteria

You'll know everything is working when:

1. ✅ Can navigate between tabs smoothly
2. ✅ Daily view shows today's tasks
3. ✅ Calendar displays with task indicators
4. ✅ Month tracker shows correct data
5. ✅ Analytics loads within 2 seconds
6. ✅ Can create recurring tasks
7. ✅ Tasks update in real-time
8. ✅ Looks good on mobile
9. ✅ No console errors
10. ✅ All features responsive

---

Congratulations! Your Task Manager is now complete! 🎉

For detailed documentation, see:
- `IMPLEMENTATION_SUMMARY.md` - Full feature overview
- `SETUP_TESTING_GUIDE.md` - Installation & testing
- `API_DOCUMENTATION.md` - Endpoint details
