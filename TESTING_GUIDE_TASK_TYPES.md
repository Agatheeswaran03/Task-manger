# Testing Daily vs Monthly Tasks - Quick Guide

## System Status ✅

- **Backend**: Running on `http://localhost:8000`
- **Frontend**: Running on `http://localhost:5174`
- **Database**: MongoDB

---

## How to Test

### 1. **Log In or Create Account**

Go to: `http://localhost:5174/register`

Create a test account:
- Username: `test_user`
- Email: `test@example.com`
- Password: `Password123`

Or log in if you already have an account.

---

### 2. **Create Daily Tasks** (For Today Only)

**Navigate to:** `http://localhost:5174` → Click **"Today's Tasks"** tab

Click **"+ Add Task"** button and create:

#### Example Daily Task 1:
- Title: `Buy groceries`
- Description: `Milk, eggs, bread`
- Urgency: 2
- Importance: 2

**Important**: The task is automatically marked as "daily-only" and will only show TODAY.

#### Example Daily Task 2:
- Title: `Call the dentist`
- Description: `Schedule appointment for next month`
- Urgency: 3
- Importance: 2

**Result**: Both tasks appear in "Today's Tasks" view but NOT in Month Tracker.

---

### 3. **Create Monthly Tasks** (For Month Tracking)

**Navigate to:** Click **"Month Tracker"** tab

The new "**+ Add Task**" button is prominent in the header.

Click it and create:

#### Example Monthly Task 1:
- Title: `Project milestone - Phase 1`
- Description: `Complete all design documents`
- Urgency: 4
- Importance: 4
- Due Date: Click on a day in the calendar (e.g., Jan 15)

**Important**: The task is automatically marked as "monthly" and WILL be:
- Counted in month statistics
- Included in analytics
- Tracked for completion

#### Example Monthly Task 2:
- Title: `Weekly team meetings`
- Description: `Regular sync with the team`
- Urgency: 3
- Importance: 3
- Is Recurring: Check this box
- Recurrence Pattern: Weekly
- Days: Select Mon, Wed, Fri (or as needed)

#### Example Monthly Task 3:
- Title: `End of month report`
- Description: `Prepare monthly performance report`
- Urgency: 3
- Importance: 4
- Due Date: Jan 30

**Result**: All tasks appear in Month Tracker calendar.

---

### 4. **View Today's Tasks**

**Click:** "Today's Tasks" tab

**Expected**:
- ✅ Show only the daily tasks you created today
- ❌ Do NOT show any monthly tasks
- Display date, stats (Total, Pending, In Progress, Completed)
- Show completion counter

---

### 5. **View Month Tracker**

**Click:** "Month Tracker" tab

**Expected**:
- ✅ Show calendar with monthly tasks
- ❌ Do NOT show daily-only tasks
- See task counts on calendar days
- Click a day to see tasks for that day
- See stats: Total Tasks, Completed, Completion %, Recurring count

**Calendar Features**:
- Click on any day to view tasks for that day
- Use prev/next arrows to change months
- "Today" button returns to current month

---

### 6. **Update Task Status**

In either view, click on a task and change its status:

- ⏳ **Pending** → 🔄 **In Progress**
- 🔄 **In Progress** → ✅ **Completed**
- Any → ❌ **Cancelled**

**Notice**: Daily tasks update in "Today's Tasks" view. Monthly tasks update in "Month Tracker" and affect completion percentage.

---

### 7. **View Monthly Analytics** ⚡ (The Key Feature!)

**Click:** "Monthly Analysis" tab

**Expected Analytics for Monthly Tasks Only**:

1. **Completion Rate**: Shows % of monthly tasks completed
   - Excludes daily tasks from calculation
   - Updates as you mark tasks complete

2. **Priority Breakdown**: Q1, Q2, Q3, Q4 distribution
   - Based on urgency × importance matrix
   - Shows how many tasks in each quadrant

3. **Status Distribution**: Pie chart showing
   - ✅ Completed
   - ⏳ Pending
   - 🔄 In Progress
   - ❌ Cancelled

4. **Daily Task Trends**: Line graph showing
   - How many tasks per day for the month
   - Helps identify busy vs light days

5. **Metrics**:
   - Average Urgency score
   - Average Importance score
   - Total days in month

**Compare Months**:
- Use arrows (< >) to navigate to other months
- Click "Today" button to jump to current month
- Analytics update for selected month

---

## Verification Checklist

✅ **Daily Tasks Work**:
- [ ] Create a daily task today
- [ ] Go to "Today's Tasks" - see it listed
- [ ] Go to "Month Tracker" - daily task NOT visible
- [ ] Tomorrow, daily task gone from "Today's Tasks"

✅ **Monthly Tasks Work**:
- [ ] Create a monthly task for this month
- [ ] Go to "Month Tracker" - see it on calendar
- [ ] See it in task list
- [ ] Go to "Today's Tasks" - monthly task NOT visible (unless due today)
- [ ] Change its status to "Completed"

✅ **Analytics Work**:
- [ ] Go to "Monthly Analysis"
- [ ] Completion rate reflects monthly tasks only
- [ ] Create more monthly tasks
- [ ] Completion rate updates
- [ ] Create daily tasks
- [ ] Daily tasks don't affect completion rate

✅ **Recurring Works**:
- [ ] Create a recurring monthly task
- [ ] Set it to repeat weekly/daily/monthly
- [ ] See it in Month Tracker multiple times
- [ ] Change one instance - others stay same
- [ ] Appears in analytics only once per occurrence

---

## Common Issues & Solutions

### Issue: Task I Created Shows in Wrong View
**Solution**: Check the task type. If you created in "Today's Tasks" it's daily-only. If in "Month Tracker" it's monthly.

### Issue: Completion Rate Doesn't Match Task Count
**Solution**: Completion rate only counts monthly tasks, not daily tasks.

### Issue: Task Appears Both Today and Month Tracker
**Solution**: This shouldn't happen - check if it's a monthly task due today. It will show in both.

### Issue: Monthly Task Doesn't Appear in Analytics
**Solution**: 
- Make sure it's set to `task_type: 'monthly'`
- Make sure it's in the selected month/year
- Refresh the analytics page

---

## API Endpoints You Can Test

### Create Daily Task
```bash
POST /api/tasks/
{
  "title": "Quick daily task",
  "description": "For today only",
  "urgency": 2,
  "importance": 2,
  "task_type": "daily",
  "due_date": "2026-01-06T00:00:00Z"
}
```

### Get Daily Tasks
```bash
GET /api/tasks/daily_tasks/
```

### Get Monthly Tasks
```bash
GET /api/tasks/monthly_tasks/?year=2026&month=1
```

### Get Analytics
```bash
GET /api/tasks/analytics/?year=2026&month=1
```

---

## Expected Behavior Summary

| Action | Daily Task | Monthly Task |
|--------|-----------|--------------|
| Create | "Today's Tasks" tab | "Month Tracker" tab |
| View Today | ✅ Today only | ✅ Only if due today |
| View Month | ❌ Never | ✅ All month |
| Analytics | ❌ Not included | ✅ Included |
| Recurring | ⚠️ Not recommended | ✅ Full support |
| Update Status | Local updates | Affects % complete |

---

## Next Steps

1. ✅ Test creating both task types
2. ✅ Verify filtering works correctly
3. ✅ Update task statuses
4. ✅ View analytics changes
5. ✅ Test switching between months
6. ✅ Test recurring monthly tasks

Enjoy your new dual task system! 🎉

