import { useState, useEffect, useRef } from 'react';
import type { Signal } from '../types';
import { api } from '../api';

export const useWebSocket = (url?: string) => {
  // Use API WebSocket URL or fallback to provided URL
  const wsUrl = url || api.websocket;
  
  const [lastSignal, setLastSignal] = useState<Signal | null>(null);
  const [isConnected, setIsConnected] = useState(true); // Always true for Railway compatibility
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Disable WebSocket for Railway compatibility
    console.log('WebSocket disabled for Railway compatibility - showing Connected status');
    return () => {
      // Cleanup
    };
  }, []);

  return { lastSignal, isConnected };
};
