from django.apps import AppConfig


class TasksConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tasks'

    def ready(self):
        """Connect to MongoDB on startup"""
        try:
            from .models import ensure_mongodb_connection
            ensure_mongodb_connection()
            print("MongoDB connection initialized on startup")
        except Exception as e:
            print(f"Failed to initialize MongoDB on startup: {e}")
