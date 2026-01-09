from mongoengine import Document, StringField, IntField, DateTimeField, ReferenceField, BooleanField, ListField
from datetime import datetime
from mongoengine import connect, disconnect
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# MongoDB connection flag
# MongoDB connection handled in apps.py via mongoengine.connect

class Task(Document):
    """Task model for MongoDB"""
    title = StringField(required=True, max_length=200)
    description = StringField(max_length=1000)
    user_id = StringField(required=True)  # Django user ID as string
    urgency = IntField(default=2, min_value=1, max_value=4)  # 1-4 scale
    importance = IntField(default=2, min_value=1, max_value=4)  # 1-4 scale
    priority_quadrant = StringField(max_length=20)  # Q1, Q2, Q3, Q4
    priority_score = IntField(default=0)  # Calculated priority score
    status = StringField(default='pending', choices=['pending', 'in_progress', 'completed', 'cancelled'])
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    # Task classification
    task_type = StringField(default='monthly', choices=['daily', 'monthly'])  # Whether this is a daily-only or monthly task
    
    # Recurring task fields
    is_recurring = BooleanField(default=False)
    recurrence_pattern = StringField(choices=['daily', 'weekly', 'monthly'], default=None)
    recurrence_days = ListField(IntField())  # For weekly: [0-6] (0=Monday), for monthly: [1-31]
    recurrence_end_date = DateTimeField(default=None)  # When recurring task stops
    due_date = DateTimeField(default=None)  # Due date for the task
    due_time = StringField(default=None)  # Due time in HH:MM format
    parent_task_id = StringField(default=None)  # For generated instances of recurring tasks
    
    meta = {
        'collection': 'tasks',
        'indexes': ['user_id', 'priority_score', 'created_at', 'due_date', 'is_recurring'],
        'ordering': ['-priority_score', '-created_at']
    }
    
    def save(self, *args, **kwargs):
        """Override save to update updated_at"""
        self.updated_at = datetime.utcnow()
        return super(Task, self).save(*args, **kwargs)
    
    def __str__(self):
        return self.title
