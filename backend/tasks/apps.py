from django.apps import AppConfig


class TasksConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tasks'

    def ready(self):
        """Connect to MongoDB on startup"""
        try:
            from django.conf import settings
            from mongoengine import connect
            
            # Check if using URI (MongoDB Atlas) or individual settings
            if 'host' in settings.MONGODB_SETTINGS and settings.MONGODB_SETTINGS['host'].startswith('mongodb'):
                # URI-based connection (MongoDB Atlas)
                connect(host=settings.MONGODB_SETTINGS['host'], alias='default')
            else:
                # Individual settings connection (local MongoDB)
                connect(
                    db=settings.MONGODB_SETTINGS.get('db', 'agathees_db'),
                    host=settings.MONGODB_SETTINGS.get('host', 'localhost'),
                    port=settings.MONGODB_SETTINGS.get('port', 27017),
                    username=settings.MONGODB_SETTINGS.get('username') or None,
                    password=settings.MONGODB_SETTINGS.get('password') or None,
                    alias='default'
                )
            
            print("MongoDB connection initialized on startup")
        except Exception as e:
            print(f"Failed to initialize MongoDB on startup: {e}")
