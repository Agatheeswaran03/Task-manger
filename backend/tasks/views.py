from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Task, ensure_mongodb_connection
from .serializers import TaskSerializer
from .ai_service import analyze_task
from .priority_calculator import calculate_priority_quadrant, calculate_priority_score
from datetime import datetime, timedelta
from django.db.models import Q
from collections import defaultdict
import calendar


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing tasks.
    Provides CRUD operations and AI reanalysis.
    """
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get tasks for the current user"""
        ensure_mongodb_connection()
        user_id = str(self.request.user.id)
        return Task.objects(user_id=user_id).order_by('-priority_score', '-created_at')
    
    def list(self, request, *args, **kwargs):
        """List all tasks for the current user"""
        try:
            ensure_mongodb_connection()
            user_id = str(request.user.id)
            tasks_queryset = Task.objects(user_id=user_id).order_by('-priority_score', '-created_at')
            # Convert MongoDB queryset to list
            tasks_list = list(tasks_queryset)
            serializer = self.get_serializer(tasks_list, many=True)
            return Response(serializer.data)
        except Exception as e:
            import traceback
            print(f"Error listing tasks: {str(e)}")
            print(traceback.format_exc())
            # Return empty array on error instead of error message
            return Response([], status=status.HTTP_200_OK)
    
    def retrieve(self, request, *args, **kwargs):
        """Retrieve a single task"""
        try:
            ensure_mongodb_connection()
            pk = kwargs.get('pk')
            user_id = str(request.user.id)
            task = Task.objects.get(id=pk, user_id=user_id)
            serializer = self.get_serializer(task)
            return Response(serializer.data)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_object(self):
        """Get a single task object"""
        ensure_mongodb_connection()
        pk = self.kwargs.get('pk')
        user_id = str(self.request.user.id)
        try:
            return Task.objects.get(id=pk, user_id=user_id)
        except Task.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound('Task not found')
    
    def get_serializer_context(self):
        """Add request to serializer context"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def create(self, request, *args, **kwargs):
        """Create task with AI analysis if description provided"""
        try:
            ensure_mongodb_connection()
            
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            task_data = serializer.validated_data.copy()
            
            # If description is provided, use AI to analyze
            if task_data.get('description'):
                try:
                    ai_result = analyze_task(task_data['description'])
                    task_data['urgency'] = ai_result['urgency']
                    task_data['importance'] = ai_result['importance']
                except Exception as ai_error:
                    # If AI fails, use default values
                    print(f"AI analysis failed: {str(ai_error)}")
                    task_data['urgency'] = task_data.get('urgency', 2)
                    task_data['importance'] = task_data.get('importance', 2)
            
            # Calculate priority
            quadrant = calculate_priority_quadrant(
                task_data.get('urgency', 2),
                task_data.get('importance', 2)
            )
            priority_score = calculate_priority_score(
                task_data.get('urgency', 2),
                task_data.get('importance', 2),
                quadrant
            )
            
            task_data['priority_quadrant'] = quadrant
            task_data['priority_score'] = priority_score
            task_data['user_id'] = str(request.user.id)
            
            # Create and save task
            task = Task(**task_data)
            task.save()
            
            # Broadcast to WebSocket
            try:
                self._broadcast_task_update('created', task)
            except Exception as ws_error:
                print(f"WebSocket broadcast failed: {str(ws_error)}")
            
            response_serializer = self.get_serializer(task)
            headers = self.get_success_headers(response_serializer.data)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            
        except ConnectionError as e:
            # MongoDB connection error
            error_msg = "MongoDB is not running. Please start MongoDB and try again."
            print(error_msg)
            print(f"Connection error: {str(e)}")
            return Response(
                {'error': error_msg},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            import traceback
            error_msg = f"Failed to create task: {str(e)}"
            print(error_msg)
            print(traceback.format_exc())
            return Response(
                {'error': error_msg},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def update(self, request, *args, **kwargs):
        """Update task and broadcast changes - optimized for speed"""
        try:
            ensure_mongodb_connection()
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            
            # Fast path: if only status is being updated, skip serializer validation overhead
            update_data = request.data
            if partial and len(update_data) == 1 and 'status' in update_data:
                # Direct status update - fastest path
                instance.status = update_data['status']
                instance.save()
                
                # Broadcast update (non-blocking)
                try:
                    self._broadcast_task_update('updated', instance)
                except:
                    pass
                
                response_serializer = self.get_serializer(instance)
                return Response(response_serializer.data)
            
            # Full update with validation
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            
            # Only recalculate priority if urgency or importance changed
            task_data = serializer.validated_data
            if 'urgency' in task_data or 'importance' in task_data:
                urgency = task_data.get('urgency', instance.urgency)
                importance = task_data.get('importance', instance.importance)
                
                quadrant = calculate_priority_quadrant(urgency, importance)
                priority_score = calculate_priority_score(urgency, importance, quadrant)
                
                task_data['priority_quadrant'] = quadrant
                task_data['priority_score'] = priority_score
            
            task = serializer.save()
            
            # Broadcast update (non-blocking)
            try:
                self._broadcast_task_update('updated', task)
            except:
                pass
            
            response_serializer = self.get_serializer(task)
            return Response(response_serializer.data)
            
        except Exception as e:
            import traceback
            print(f"Update error: {str(e)}")
            print(traceback.format_exc())
            return Response(
                {'error': f'Failed to update task: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def destroy(self, request, *args, **kwargs):
        """Delete task and broadcast removal"""
        instance = self.get_object()
        task_id = str(instance.id)
        instance.delete()
        self._broadcast_task_update('deleted', {'id': task_id})
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def reanalyze(self, request, pk=None):
        """Re-analyze task using AI"""
        try:
            task = Task.objects.get(id=pk, user_id=str(request.user.id))
        except Task.DoesNotExist:
            return Response(
                {'error': 'Task not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if not task.description:
            return Response(
                {'error': 'Task has no description to analyze'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Analyze with AI
        ai_result = analyze_task(task.description)
        task.urgency = ai_result['urgency']
        task.importance = ai_result['importance']
        
        # Recalculate priority
        quadrant = calculate_priority_quadrant(task.urgency, task.importance)
        priority_score = calculate_priority_score(task.urgency, task.importance, quadrant)
        
        task.priority_quadrant = quadrant
        task.priority_score = priority_score
        task.save()
        
        # Broadcast update
        self._broadcast_task_update('updated', task)
        
        serializer = self.get_serializer(task)
        return Response(serializer.data)
    
    def _broadcast_task_update(self, action: str, task_data):
        """Broadcast task update via WebSocket (non-blocking)"""
        # Run in background thread to avoid blocking the response
        import threading
        def broadcast():
            try:
                from channels.layers import get_channel_layer
                from asgiref.sync import async_to_sync
                
                channel_layer = get_channel_layer()
                user_id = str(self.request.user.id)
                
                # Serialize task if it's a Task object
                if hasattr(task_data, 'id'):
                    serializer = self.get_serializer(task_data)
                    task_dict = serializer.data
                else:
                    task_dict = task_data
                
                # Broadcast to user's channel group
                async_to_sync(channel_layer.group_send)(
                    f'user_{user_id}',
                    {
                        'type': 'task_update',
                        'action': action,
                        'task': task_dict
                    }
                )
            except Exception as e:
                # WebSocket broadcast is optional, don't fail if it doesn't work
                pass  # Silently fail to avoid blocking
        
        # Start broadcast in background thread
        thread = threading.Thread(target=broadcast, daemon=True)
        thread.start()
    
    @action(detail=False, methods=['get'])
    def daily_tasks(self, request):
        """Get daily-only tasks for today (tasks not in monthly tracking)"""
        try:
            ensure_mongodb_connection()
            user_id = str(request.user.id)
            today = datetime.now().date()
            
            # Get tasks for today that are marked as 'daily' type
            tasks = Task.objects(user_id=user_id, task_type='daily')
            
            daily_tasks = []
            for task in tasks:
                # Check if task is due today
                if task.due_date and task.due_date.date() == today:
                    daily_tasks.append(task)
            
            serializer = self.get_serializer(daily_tasks, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def monthly_tasks(self, request):
        """Get monthly tasks for a specific month (excludes daily-only tasks)"""
        try:
            ensure_mongodb_connection()
            user_id = str(request.user.id)
            
            # Get month and year from query params (default to current month)
            year = int(request.query_params.get('year', datetime.now().year))
            month = int(request.query_params.get('month', datetime.now().month))
            
            # Get first and last day of month
            first_day = datetime(year, month, 1)
            last_day = datetime(year, month, calendar.monthrange(year, month)[1], 23, 59, 59)
            
            # Get monthly tasks for user (exclude daily-only tasks)
            tasks = Task.objects(user_id=user_id, task_type='monthly')
            
            monthly_tasks = []
            for task in tasks:
                # Check if task is due in this month
                if task.due_date and first_day <= task.due_date <= last_day:
                    monthly_tasks.append(task)
                # Check recurring tasks
                elif task.is_recurring:
                    if not task.recurrence_end_date or task.recurrence_end_date >= first_day:
                        monthly_tasks.append(task)
            
            serializer = self.get_serializer(monthly_tasks, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Get monthly analytics dashboard data"""
        try:
            ensure_mongodb_connection()
            user_id = str(request.user.id)
            
            # Get month and year from query params
            year = int(request.query_params.get('year', datetime.now().year))
            month = int(request.query_params.get('month', datetime.now().month))
            
            # Get first and last day of month
            first_day = datetime(year, month, 1)
            last_day = datetime(year, month, calendar.monthrange(year, month)[1], 23, 59, 59)
            
            # Get monthly tasks only (exclude daily-only tasks)
            all_tasks = Task.objects(user_id=user_id, task_type='monthly')
            
            # Filter tasks for this month
            month_tasks = []
            for task in all_tasks:
                task_date = task.due_date or task.created_at
                if not task_date:
                    continue
                # Handle potential timezone issues
                if hasattr(task_date, 'tzinfo') and task_date.tzinfo is not None:
                    # Make comparable by converting both to naive or aware
                    # Here we convert task_date to naive for simple comparison if first_day is naive
                    task_date = task_date.replace(tzinfo=None)
                
                if first_day <= task_date <= last_day:
                    month_tasks.append(task)
            
            # Calculate analytics
            total_tasks = len(month_tasks)
            completed_tasks = len([t for t in month_tasks if t.status == 'completed'])
            pending_tasks = len([t for t in month_tasks if t.status == 'pending'])
            in_progress_tasks = len([t for t in month_tasks if t.status == 'in_progress'])
            
            completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
            
            # Priority breakdown
            priority_counts = defaultdict(int)
            for task in month_tasks:
                priority_counts[task.priority_quadrant] += 1
            
            # Status breakdown
            status_counts = {
                'completed': completed_tasks,
                'pending': pending_tasks,
                'in_progress': in_progress_tasks,
                'cancelled': len([t for t in month_tasks if t.status == 'cancelled'])
            }
            
            # Daily task count
            daily_counts = defaultdict(int)
            for task in month_tasks:
                task_date = (task.due_date or task.created_at).date()
                daily_counts[str(task_date)] += 1
            
            # Urgency/Importance breakdown
            urgency_avg = sum(t.urgency for t in month_tasks) / total_tasks if total_tasks > 0 else 0
            importance_avg = sum(t.importance for t in month_tasks) / total_tasks if total_tasks > 0 else 0
            
            return Response({
                'month': month,
                'year': year,
                'total_tasks': total_tasks,
                'completed_tasks': completed_tasks,
                'pending_tasks': pending_tasks,
                'in_progress_tasks': in_progress_tasks,
                'completion_rate': round(completion_rate, 2),
                'priority_breakdown': dict(priority_counts),
                'status_breakdown': status_counts,
                'daily_counts': dict(daily_counts),
                'avg_urgency': round(urgency_avg, 2),
                'avg_importance': round(importance_avg, 2),
                'month_name': calendar.month_name[month],
                'total_days_in_month': calendar.monthrange(year, month)[1]
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
