import { useEffect, useRef } from 'react';
import wsService from '../services/websocket';
import { useQueryClient } from '@tanstack/react-query';

export const useWebSocket = (enabled = true) => {
  const queryClient = useQueryClient();
  const handlersRef = useRef({});

  useEffect(() => {
    if (!enabled) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    // Connect WebSocket
    wsService.connect(token);

    // Handle task updates
    const handleTaskUpdate = (data) => {
      // Invalidate tasks query to refetch
      queryClient.invalidateQueries(['tasks']);
    };

    // Handle connection events
    const handleConnected = () => {
      console.log('WebSocket connected');
    };

    const handleDisconnected = () => {
      console.log('WebSocket disconnected');
    };

    const handleError = (error) => {
      console.error('WebSocket error:', error);
    };

    // Register event listeners
    wsService.on('task_update', handleTaskUpdate);
    wsService.on('connected', handleConnected);
    wsService.on('disconnected', handleDisconnected);
    wsService.on('error', handleError);

    // Store handlers for cleanup
    handlersRef.current = {
      taskUpdate: handleTaskUpdate,
      connected: handleConnected,
      disconnected: handleDisconnected,
      error: handleError,
    };

    // Cleanup on unmount
    return () => {
      wsService.off('task_update', handlersRef.current.taskUpdate);
      wsService.off('connected', handlersRef.current.connected);
      wsService.off('disconnected', handlersRef.current.disconnected);
      wsService.off('error', handlersRef.current.error);
      wsService.disconnect();
    };
  }, [enabled, queryClient]);

  return {
    isConnected: wsService.isConnected(),
  };
};

