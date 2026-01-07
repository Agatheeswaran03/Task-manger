# Setup & Testing Guide

## Prerequisites
- Python 3.8+
- Node.js 14+
- MongoDB running locally or remote
- Django with Django REST Framework
- React with necessary dependencies

---

## Backend Setup

### 1. Update Django Settings (if needed)
Ensure MongoDB is configured in `backend/config/settings.py`:

```python
MONGODB_SETTINGS = {
    'db': 'task_manager',
    'host': 'localhost',
    'port': 27017,
    'username': 'optional',
    'password': 'optional'
}
```

### 2. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Run Migrations (if applicable)
```bash
python manage.py migrate
```

### 4. Start Backend Server
```bash
python manage.py runserver
```
Server will run at: `http://localhost:8000`

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
App will run at: `http://localhost:5173` (or shown in terminal)

### 3. Build for Production
```bash
npm run build
```

---

## Testing the New Features

### Test 1: Daily Tasks View
1. Navigate to Dashboard
2. Click "📅 Today" tab
3. Create a task with today's due date
4. Verify task appears in Daily Tasks view
5. Check statistics update correctly

### Test 2: Calendar & Month Tracker
1. Click "🗓️ Month Tracker" tab
2. Navigate between months
3. Create tasks with specific due dates
4. Verify calendar shows task indicators
5. Click dates to view day details
6. Add recurring task and verify

### Test 3: Monthly Analytics
1. Click "📊 Analytics" tab
2. Create 5-10 tasks with various:
   - Due dates in current month
   - Different statuses (pending, in progress, completed)
   - Different priorities
3. Complete some tasks
4. Verify analytics show:
   - Correct completion rate
   - Proper status breakdown
   - Accurate priority distribution
   - Daily activity chart

### Test 4: Recurring Tasks
1. Create task in Month Tracker
2. Enable "Make it Recurring"
3. Set pattern to "Daily"
4. Set end date 7 days from now
5. Verify task appears in daily view for each day
6. Check calendar shows task on multiple days

### Test 5: Responsive Design
1. Open app on mobile device or use DevTools (F12)
2. Test at 320px, 768px, 1024px widths
3. Verify:
   - Navigation tabs work properly
   - Calendar displays correctly
   - Tasks are readable
   - Buttons are touch-friendly

---

## API Testing

### Test Daily Tasks Endpoint
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/tasks/daily_tasks/
```

Expected Response:
```json
[
  {
    "id": "...",
    "title": "Task",
    "due_date": "2026-01-06T12:00:00Z",
    "status": "pending",
    "is_recurring": false,
    ...
  }
]
```

### Test Monthly Tasks Endpoint
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/tasks/monthly_tasks/?year=2026&month=1
```

### Test Analytics Endpoint
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/tasks/analytics/?year=2026&month=1
```

Expected Response:
```json
{
  "month": 1,
  "year": 2026,
  "total_tasks": 10,
  "completed_tasks": 5,
  "pending_tasks": 3,
  "in_progress_tasks": 2,
  "completion_rate": 50.0,
  "priority_breakdown": {
    "Q1": 2,
    "Q2": 3,
    "Q3": 4,
    "Q4": 1
  },
  "status_breakdown": {
    "completed": 5,
    "pending": 3,
    "in_progress": 2,
    "cancelled": 0
  },
  "daily_counts": {
    "2026-01-01": 2,
    "2026-01-02": 3,
    ...
  },
  "avg_urgency": 2.5,
  "avg_importance": 2.8,
  "month_name": "January",
  "total_days_in_month": 31
}
```

---

## Troubleshooting

### Issue: Calendar not showing tasks
**Solution:**
- Ensure tasks have `due_date` field set
- Check browser console for errors
- Verify API endpoint returns data

### Issue: Analytics showing no data
**Solution:**
- Create tasks first
- Ensure tasks have dates in selected month
- Check API endpoint with curl
- Clear browser cache

### Issue: Recurring tasks not showing
**Solution:**
- Verify `is_recurring` is set to true
- Check `recurrence_pattern` is valid (daily/weekly/monthly)
- Ensure `recurrence_end_date` is in future (or null)
- Check `recurrence_days` format

### Issue: Styles not loading
**Solution:**
- Clear browser cache (Ctrl+Shift+Del)
- Ensure CSS files are in correct paths
- Check for console errors
- Restart dev server

### Issue: Authentication errors
**Solution:**
- Ensure user is logged in
- Check token in localStorage
- Verify Authorization header is sent
- Check backend token validation

---

## Performance Tips

1. **For Large Task Lists:**
   - Implement pagination
   - Use virtual scrolling for lists
   - Lazy load analytics data

2. **For Multiple Users:**
   - Add caching on backend
   - Implement WebSocket real-time updates
   - Use database indexing

3. **For Mobile:**
   - Minimize initial load
   - Defer non-critical images
   - Use service workers for offline

---

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 12+, Chrome Mobile 90+)

---

## Debug Mode

### Enable Console Logging
In `frontend/src/pages/Dashboard.jsx`:
```javascript
// Add this for debugging:
console.log('Active View:', activeView);
console.log('Tasks:', tasks);
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Filter for XHR/Fetch
4. Check request/response payloads

### Check Local Storage
```javascript
// In browser console:
console.log(localStorage.getItem('access_token'));
console.log(localStorage.getItem('user'));
```

---

## Common Issues & Solutions

### Tasks not syncing
- Check WebSocket connection
- Verify real-time updates are enabled
- Check browser console for errors

### Slow analytics loading
- Create fewer test tasks initially
- Check MongoDB performance
- Add database indexes

### Month navigation broken
- Ensure date calculations are correct
- Check for timezone issues
- Verify month/year parameter passing

---

## Verification Checklist

- [ ] Daily tasks view loads and shows today's tasks
- [ ] Calendar displays correctly with task indicators
- [ ] Month tracker shows tasks for selected month
- [ ] Analytics shows correct statistics
- [ ] Can create recurring tasks
- [ ] Tasks update status correctly
- [ ] Responsive design works on mobile
- [ ] All API endpoints return correct data
- [ ] Error messages display properly
- [ ] Smooth transitions between views

---

## Support & Resources

- Django REST Framework: https://www.django-rest-framework.org/
- React Hooks: https://react.dev/reference/react/hooks
- MongoDB: https://docs.mongodb.com/
- CSS Grid: https://developer.mozilla.org/en-US/docs/Web/CSS/grid

---

## Next Steps

1. Test all features thoroughly
2. Gather user feedback
3. Optimize performance if needed
4. Deploy to production
5. Set up monitoring and analytics

Enjoy your enhanced Task Manager! 🚀
