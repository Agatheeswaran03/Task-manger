# API Documentation - New Endpoints

## Base URL
```
http://localhost:8000/api/tasks/
```

## Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer <access_token>
```

---

## Endpoints

### 1. Daily Tasks
**Get tasks scheduled for today**

```
GET /api/tasks/daily_tasks/
```

#### Parameters
None (uses current system date)

#### Response (200 OK)
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "Complete project report",
    "description": "Finish the monthly report",
    "urgency": 4,
    "importance": 4,
    "priority_quadrant": "Q1",
    "priority_score": 100,
    "status": "pending",
    "created_at": "2026-01-06T10:30:00Z",
    "updated_at": "2026-01-06T10:30:00Z",
    "is_recurring": false,
    "recurrence_pattern": null,
    "recurrence_days": [],
    "recurrence_end_date": null,
    "due_date": "2026-01-06T12:00:00Z",
    "due_time": "09:00",
    "parent_task_id": null
  }
]
```

#### Error Response (401)
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

### 2. Monthly Tasks
**Get all tasks in a specific month**

```
GET /api/tasks/monthly_tasks/?year=2026&month=1
```

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| year | integer | No | Year (default: current year) |
| month | integer | No | Month 1-12 (default: current month) |

#### Example Requests
```bash
# Current month
GET /api/tasks/monthly_tasks/

# Specific month
GET /api/tasks/monthly_tasks/?year=2026&month=3

# December 2025
GET /api/tasks/monthly_tasks/?year=2025&month=12
```

#### Response (200 OK)
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "Monthly planning",
    "description": "",
    "urgency": 3,
    "importance": 4,
    "priority_quadrant": "Q2",
    "priority_score": 75,
    "status": "pending",
    "created_at": "2026-01-01T08:00:00Z",
    "updated_at": "2026-01-01T08:00:00Z",
    "is_recurring": true,
    "recurrence_pattern": "monthly",
    "recurrence_days": [1],
    "recurrence_end_date": "2026-12-31T23:59:59Z",
    "due_date": "2026-01-01T09:00:00Z",
    "due_time": "09:00",
    "parent_task_id": null
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "title": "Team standup",
    "description": "Daily 10am standup",
    "urgency": 2,
    "importance": 3,
    "priority_quadrant": "Q2",
    "priority_score": 50,
    "status": "completed",
    "created_at": "2026-01-02T09:00:00Z",
    "updated_at": "2026-01-02T10:30:00Z",
    "is_recurring": true,
    "recurrence_pattern": "daily",
    "recurrence_days": [],
    "recurrence_end_date": null,
    "due_date": "2026-01-02T10:00:00Z",
    "due_time": "10:00",
    "parent_task_id": null
  }
]
```

---

### 3. Analytics Dashboard
**Get comprehensive monthly analytics**

```
GET /api/tasks/analytics/?year=2026&month=1
```

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| year | integer | No | Year (default: current year) |
| month | integer | No | Month 1-12 (default: current month) |

#### Example Requests
```bash
# Current month analytics
GET /api/tasks/analytics/

# Specific month analytics
GET /api/tasks/analytics/?year=2026&month=6
```

#### Response (200 OK)
```json
{
  "month": 1,
  "year": 2026,
  "month_name": "January",
  "total_days_in_month": 31,
  "total_tasks": 25,
  "completed_tasks": 18,
  "pending_tasks": 5,
  "in_progress_tasks": 2,
  "completion_rate": 72.0,
  "priority_breakdown": {
    "Q1": 5,
    "Q2": 8,
    "Q3": 7,
    "Q4": 5
  },
  "status_breakdown": {
    "completed": 18,
    "pending": 5,
    "in_progress": 2,
    "cancelled": 0
  },
  "daily_counts": {
    "2026-01-01": 3,
    "2026-01-02": 2,
    "2026-01-03": 4,
    "2026-01-04": 2,
    "2026-01-05": 3,
    "2026-01-06": 2,
    "2026-01-07": 2,
    "2026-01-08": 1,
    "2026-01-09": 1
  },
  "avg_urgency": 2.68,
  "avg_importance": 3.12
}
```

#### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| month | integer | Month number (1-12) |
| year | integer | Year value |
| month_name | string | Full month name |
| total_days_in_month | integer | Number of days in month |
| total_tasks | integer | Total tasks in month |
| completed_tasks | integer | Number of completed tasks |
| pending_tasks | integer | Number of pending tasks |
| in_progress_tasks | integer | Number of in-progress tasks |
| completion_rate | float | Percentage of completed tasks (0-100) |
| priority_breakdown | object | Count by priority quadrant |
| status_breakdown | object | Count by task status |
| daily_counts | object | Number of tasks per day |
| avg_urgency | float | Average urgency (1-4) |
| avg_importance | float | Average importance (1-4) |

---

## Task Status Values

| Status | Description |
|--------|-------------|
| pending | Task not started |
| in_progress | Currently working on task |
| completed | Task finished |
| cancelled | Task cancelled/skipped |

---

## Priority Quadrants

| Quadrant | Urgency | Importance | Emoji |
|----------|---------|-----------|-------|
| Q1 | High | High | 🔴 |
| Q2 | Low | High | 🟡 |
| Q3 | High | Low | 🟢 |
| Q4 | Low | Low | ⚪ |

---

## Recurrence Patterns

| Pattern | Description | Example |
|---------|-------------|---------|
| daily | Task repeats every day | Daily standup |
| weekly | Task repeats on specific days | Weekly meeting |
| monthly | Task repeats on specific dates | Monthly review |

### Weekly Pattern Example
```json
{
  "is_recurring": true,
  "recurrence_pattern": "weekly",
  "recurrence_days": [0, 2, 4],
  "recurrence_end_date": "2026-12-31T23:59:59Z"
}
```
*Note: Days are 0-6 (Sunday-Saturday)*

### Monthly Pattern Example
```json
{
  "is_recurring": true,
  "recurrence_pattern": "monthly",
  "recurrence_days": [1, 15],
  "recurrence_end_date": "2026-12-31T23:59:59Z"
}
```
*Note: Days are 1-31 (date of month)*

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid month parameter. Must be 1-12."
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 500 Server Error
```json
{
  "error": "Failed to fetch analytics: [error message]"
}
```

---

## Rate Limiting

Currently no rate limiting. In production, consider implementing:
- 100 requests per minute per user
- 1000 requests per hour per user

---

## Caching

- Daily tasks: Cache for 5 minutes
- Monthly tasks: Cache for 10 minutes
- Analytics: Cache for 15 minutes (invalidate on task updates)

---

## Pagination (Future)

Currently returns all results. In future, implement:
```
GET /api/tasks/monthly_tasks/?year=2026&month=1&page=1&page_size=50
```

---

## Filtering (Future)

Potential filtering options:
```
GET /api/tasks/monthly_tasks/?year=2026&month=1&status=completed
GET /api/tasks/monthly_tasks/?year=2026&month=1&priority_quadrant=Q1
GET /api/tasks/monthly_tasks/?year=2026&month=1&is_recurring=true
```

---

## Code Examples

### JavaScript/Fetch
```javascript
// Daily tasks
fetch('/api/tasks/daily_tasks/', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));

// Monthly analytics
const year = 2026;
const month = 1;
fetch(`/api/tasks/analytics/?year=${year}&month=${month}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

### Python/Requests
```python
import requests

headers = {
    'Authorization': f'Bearer {token}'
}

# Daily tasks
response = requests.get(
    'http://localhost:8000/api/tasks/daily_tasks/',
    headers=headers
)
tasks = response.json()

# Monthly analytics
response = requests.get(
    'http://localhost:8000/api/tasks/analytics/',
    params={'year': 2026, 'month': 1},
    headers=headers
)
analytics = response.json()
```

### cURL
```bash
# Set token
TOKEN="your_access_token"

# Daily tasks
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/tasks/daily_tasks/

# Monthly tasks
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/tasks/monthly_tasks/?year=2026&month=1"

# Analytics
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/tasks/analytics/?year=2026&month=1"
```

---

## Changelog

### Version 1.0 (Current)
- ✅ Daily tasks endpoint
- ✅ Monthly tasks endpoint
- ✅ Analytics endpoint
- ✅ Recurring task support
- ✅ Priority calculation
- ✅ Status tracking

### Version 1.1 (Planned)
- Pagination support
- Advanced filtering
- Task search
- Bulk operations
- Export to CSV/PDF

---

## Support

For API issues:
1. Check authorization token is valid
2. Verify parameters are correct
3. Check MongoDB connection
4. Review backend logs
5. Check browser console for errors

---

## Related Endpoints (Existing)

```
POST   /api/tasks/          # Create task
GET    /api/tasks/          # List all tasks
GET    /api/tasks/{id}/     # Get single task
PATCH  /api/tasks/{id}/     # Update task
DELETE /api/tasks/{id}/     # Delete task
POST   /api/tasks/{id}/reanalyze/  # AI re-analyze
```

Refer to existing API documentation for these endpoints.
