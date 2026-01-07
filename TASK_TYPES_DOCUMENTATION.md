# Task Types Documentation - Daily vs Monthly Tasks

## Overview

The task manager now distinguishes between two types of tasks to provide better organization and tracking:

- **Daily Tasks**: One-off tasks for a specific day only
- **Monthly Tasks**: Tasks that are part of monthly planning and tracking

---

## Daily Tasks

### Purpose
Daily tasks are quick, one-off items you want to complete on a specific day. They do NOT appear in monthly tracking or analytics.

### Characteristics
- Only visible on their due date
- Not included in monthly task count
- Not analyzed in monthly analytics dashboard
- Perfect for ephemeral tasks like "buy groceries", "call mom", etc.

### Creating a Daily Task
1. Navigate to **"Today's Tasks"** tab
2. Click **"+ Add Task"** button
3. Fill in task details (title, description, priority, etc.)
4. Task is automatically set as **daily-only** for today
5. It will disappear from tomorrow onwards

### Where to Find Daily Tasks
- **Today's Tasks** view - Shows only today's daily tasks
- NOT visible in Month Tracker
- NOT included in Monthly Analytics

---

## Monthly Tasks

### Purpose
Monthly tasks are planned activities for the month. They are tracked, analyzed, and included in your monthly performance metrics.

### Characteristics
- Part of monthly planning
- Included in completion statistics
- Counted in monthly analytics
- Can be recurring (daily, weekly, or monthly)
- Support detailed tracking with multiple fields

### Creating a Monthly Task
1. Navigate to **"Month Tracker"** tab
2. Click **"+ Add Task"** button (now prominently displayed)
3. Optionally select a specific day on the calendar
4. Fill in task details:
   - Title and description
   - Urgency and importance (affects priority)
   - Due date (within the month)
   - Make recurring if needed

5. Task is automatically set as **monthly task**
6. It will appear on the calendar and in analytics

### Where to Find Monthly Tasks
- **Month Tracker** view - Shows all monthly tasks with calendar visualization
- **Monthly Analytics** dashboard - Analyzed for:
  - Completion rate
  - Priority breakdown
  - Status distribution
  - Daily task counts
  - Average urgency/importance scores

---

## Task Type Field

### Backend Implementation
Each task now includes a `task_type` field:

```
task_type = 'daily'   # One-off daily task
task_type = 'monthly' # Monthly tracked task
```

### API Request Example

#### Create Daily Task
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "urgency": 2,
  "importance": 2,
  "task_type": "daily",
  "due_date": "2026-01-06T00:00:00Z"
}
```

#### Create Monthly Task
```json
{
  "title": "Project milestone",
  "description": "Complete phase 1 of the project",
  "urgency": 3,
  "importance": 4,
  "task_type": "monthly",
  "due_date": "2026-01-20T12:00:00Z",
  "is_recurring": false
}
```

---

## API Endpoints

### Daily Tasks Endpoint
**GET** `/api/tasks/daily_tasks/`

Returns all daily tasks for today (where `task_type='daily'` and `due_date=today`)

Response:
```json
[
  {
    "id": "695d16030a786ddc124f0511",
    "title": "Buy groceries",
    "status": "pending",
    "task_type": "daily",
    "due_date": "2026-01-06T00:00:00Z",
    ...
  }
]
```

### Monthly Tasks Endpoint
**GET** `/api/tasks/monthly_tasks/?year=2026&month=1`

Returns all monthly tasks for the specified month (where `task_type='monthly'`)

Parameters:
- `year`: Year (default: current year)
- `month`: Month 1-12 (default: current month)

Response:
```json
[
  {
    "id": "695d16030a786ddc124f0512",
    "title": "Project milestone",
    "status": "in_progress",
    "task_type": "monthly",
    "due_date": "2026-01-20T12:00:00Z",
    ...
  }
]
```

### Analytics Endpoint
**GET** `/api/tasks/analytics/?year=2026&month=1`

Returns analytics for monthly tasks only (excludes daily tasks)

Analytics Include:
- Total monthly tasks
- Completion rate
- Priority breakdown (Q1, Q2, Q3, Q4)
- Status distribution
- Daily task counts (how many tasks per day)
- Average urgency and importance scores

---

## Filtering Behavior

### When You See What

| View | Sees Daily Tasks | Sees Monthly Tasks | Notes |
|------|------------------|--------------------|-------|
| Today's Tasks | ✅ Yes (today only) | ❌ No | Shows only `task_type='daily'` due today |
| Month Tracker | ❌ No | ✅ Yes | Shows only `task_type='monthly'` for the month |
| Monthly Analytics | ❌ No | ✅ Yes | Analyzes only `task_type='monthly'` |
| All Tasks | ✅ Yes | ✅ Yes | Shows both types in raw task list |

---

## Recurring Tasks

### With Daily Tasks
- Daily tasks are typically one-off, so recurring is rarely used
- If a daily task is set to repeat, it creates a new daily task each occurrence

### With Monthly Tasks
- Recurring monthly tasks are tracked across months
- Patterns supported:
  - **Daily**: Task repeats every day until end date
  - **Weekly**: Task repeats on selected days (0=Mon, 1=Tue, etc.)
  - **Monthly**: Task repeats on selected dates each month

### Example Recurring Monthly Task
```json
{
  "title": "Weekly team meeting",
  "task_type": "monthly",
  "is_recurring": true,
  "recurrence_pattern": "weekly",
  "recurrence_days": [0, 2, 4],  // Monday, Wednesday, Friday
  "recurrence_end_date": "2026-12-31T23:59:59Z"
}
```

---

## Migration Notes

### For Existing Tasks
If you have tasks in the system before this update:
- All tasks default to `task_type: 'monthly'`
- You can manually change specific tasks to `task_type: 'daily'` if needed
- Daily tasks created going forward will be explicitly marked

### Database Schema Update
```python
# Added to Task model:
task_type = StringField(
    default='monthly',
    choices=['daily', 'monthly']
)
```

---

## UI Workflows

### Creating a Daily Task
1. Click **"Today's Tasks"** in navigation
2. Click **"+ Add Task"**
3. Fill form and submit
4. Task type is automatically set to `daily`
5. Task visible only on today

### Creating a Monthly Task
1. Click **"Month Tracker"** in navigation
2. Click **"+ Add Task"** (prominent button in header)
3. Optionally select a day on calendar
4. Fill form and submit
5. Task type is automatically set to `monthly`
6. Task appears on calendar and in analytics

### Viewing Analytics
1. Click **"Monthly Analysis"** in navigation
2. Use arrow buttons to change months
3. See metrics for all monthly tasks in that month
4. Daily tasks are excluded from these metrics

---

## FAQ

**Q: Can a task be both daily and monthly?**
A: No. A task must be one or the other. This keeps the system simple and focused.

**Q: What if I need a recurring daily task?**
A: Use a monthly task with `recurrence_pattern='daily'` instead. This allows tracking and analytics.

**Q: Can I convert a daily task to monthly?**
A: Not yet - you would need to delete and recreate it. Future versions may support conversion.

**Q: Do daily tasks count toward my monthly completion rate?**
A: No. Only monthly tasks are included in analytics and completion metrics.

**Q: Can daily tasks be recurring?**
A: Yes, but they won't appear in analytics. For recurring daily tasks, use a monthly task with `recurrence_pattern='daily'`.

---

## Summary

This task type system provides flexibility:
- **Daily Tasks** for quick, ad-hoc items that don't need tracking
- **Monthly Tasks** for planned work that needs analytics and monthly review

Choose the right task type for your workflow!
