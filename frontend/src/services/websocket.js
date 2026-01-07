// WebSocket Service - Disabled for production deployment
// Real-time updates disabled to simplify deployment (no Redis required)

class WebSocketService {
  constructor() {
    this.listeners = new Map();
    this.enabled = false; // WebSocket disabled
  }

  connect(token) {
    // WebSocket disabled for simpler deployment
    console.log('WebSocket disabled - using REST API only');
  }

  disconnect() {
    // No-op
  }

  send(data) {
    // No-op
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  isConnected() {
    return false; // Always return false when disabled
  }
}

// Export singleton instance
export default new WebSocketService();
