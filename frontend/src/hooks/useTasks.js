import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '../services/api';

export const useTasks = () => {
  const queryClient = useQueryClient();

  // Fetch all tasks
  const { data: tasks = [], isLoading, error, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const response = await tasksAPI.getAll();
        // Ensure we return an array
        if (Array.isArray(response.data)) {
          return response.data;
        } else if (response.data && Array.isArray(response.data.results)) {
          // Handle paginated response
          return response.data.results;
        } else {
          console.warn('Unexpected response format:', response.data);
          return [];
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        // Return empty array on error instead of throwing
        return [];
      }
    },
  });

  // Create task mutation
  const createTask = useMutation({
    mutationFn: (taskData) => tasksAPI.create(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  // Update task mutation with optimistic updates
  const updateTask = useMutation({
    mutationFn: ({ id, data }) => tasksAPI.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(['tasks']);
      
      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks']);
      
      // Optimistically update the cache
      queryClient.setQueryData(['tasks'], (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((task) =>
          task.id === id ? { ...task, ...data } : task
        );
      });
      
      // Return context with snapshot
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(['tasks']);
    },
  });

  // Delete task mutation
  const deleteTask = useMutation({
    mutationFn: (id) => tasksAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  // Reanalyze task mutation
  const reanalyzeTask = useMutation({
    mutationFn: (id) => tasksAPI.reanalyze(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  return {
    tasks,
    isLoading,
    error,
    refetch,
    createTask,
    updateTask,
    deleteTask,
    reanalyzeTask,
  };
};

