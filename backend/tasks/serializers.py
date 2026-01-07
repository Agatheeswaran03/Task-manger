from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.Serializer):
    """Serializer for Task model"""
    id = serializers.CharField(read_only=True)
    title = serializers.CharField(max_length=200)
    description = serializers.CharField(max_length=1000, required=False, allow_blank=True)
    urgency = serializers.IntegerField(min_value=1, max_value=4, default=2)
    importance = serializers.IntegerField(min_value=1, max_value=4, default=2)
    priority_quadrant = serializers.CharField(read_only=True)
    priority_score = serializers.IntegerField(read_only=True)
    status = serializers.ChoiceField(
        choices=['pending', 'in_progress', 'completed', 'cancelled'],
        default='pending'
    )
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    # Task classification
    task_type = serializers.ChoiceField(
        choices=['daily', 'monthly'],
        default='monthly'
    )
    
    # Recurring task fields
    is_recurring = serializers.BooleanField(default=False)
    recurrence_pattern = serializers.ChoiceField(
        choices=['daily', 'weekly', 'monthly'],
        required=False,
        allow_null=True
    )
    recurrence_days = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        default=[]
    )
    recurrence_end_date = serializers.DateTimeField(required=False, allow_null=True)
    due_date = serializers.DateTimeField(required=False, allow_null=True)
    due_time = serializers.CharField(max_length=5, required=False, allow_null=True)  # HH:MM
    parent_task_id = serializers.CharField(required=False, allow_null=True)
    
    def create(self, validated_data):
        """Create a new task"""
        user_id = self.context['request'].user.id
        validated_data['user_id'] = str(user_id)
        
        # Calculate priority
        from .priority_calculator import calculate_priority_quadrant, calculate_priority_score
        
        quadrant = calculate_priority_quadrant(
            validated_data['urgency'],
            validated_data['importance']
        )
        priority_score = calculate_priority_score(
            validated_data['urgency'],
            validated_data['importance'],
            quadrant
        )
        
        validated_data['priority_quadrant'] = quadrant
        validated_data['priority_score'] = priority_score
        
        task = Task(**validated_data)
        task.save()
        return task
    
    def update(self, instance, validated_data):
        """Update an existing task - optimized for speed"""
        # Fast path: if only status is being updated, skip priority recalculation
        if len(validated_data) == 1 and 'status' in validated_data:
            instance.status = validated_data['status']
            instance.save()
            return instance
        
        # Full update
        for key, value in validated_data.items():
            setattr(instance, key, value)
        
        # Only recalculate priority if urgency or importance changed
        if 'urgency' in validated_data or 'importance' in validated_data:
            from .priority_calculator import calculate_priority_quadrant, calculate_priority_score
            
            urgency = instance.urgency
            importance = instance.importance
            
            quadrant = calculate_priority_quadrant(urgency, importance)
            priority_score = calculate_priority_score(urgency, importance, quadrant)
            
            instance.priority_quadrant = quadrant
            instance.priority_score = priority_score
        
        instance.save()
        return instance
    
    def to_representation(self, instance):
        """Convert MongoDB ObjectId to string"""
        data = {
            'id': str(instance.id),
            'title': instance.title,
            'description': instance.description or '',
            'urgency': instance.urgency,
            'importance': instance.importance,
            'priority_quadrant': instance.priority_quadrant,
            'priority_score': instance.priority_score,
            'status': instance.status,
            'created_at': instance.created_at.isoformat() if instance.created_at else None,
            'updated_at': instance.updated_at.isoformat() if instance.updated_at else None,
            'is_recurring': instance.is_recurring,
            'recurrence_pattern': instance.recurrence_pattern,
            'recurrence_days': instance.recurrence_days or [],
            'recurrence_end_date': instance.recurrence_end_date.isoformat() if instance.recurrence_end_date else None,
            'due_date': instance.due_date.isoformat() if instance.due_date else None,
            'due_time': instance.due_time,
            'parent_task_id': str(instance.parent_task_id) if instance.parent_task_id else None,
        }
        return data

