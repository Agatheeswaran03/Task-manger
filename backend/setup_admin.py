import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User

# Try to get existing admin user
try:
    user = User.objects.get(username='admin')
    user.set_password('admin123')
    user.save()
    print("Admin password updated successfully!")
except User.DoesNotExist:
    user = User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("Admin user created successfully!")
