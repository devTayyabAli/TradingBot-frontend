import { useState, useEffect, useRef } from 'react';
import type { Signal } from '../types';
import { api } from '../api';

export const useWebSocket = (url?: string) => {
  // Use API WebSocket URL or fallback to provided URL
  const wsUrl = url || api.websocket;
  
  const [lastSignal, setLastSignal] = useState<Signal | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        console.log('WS Connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Only update signal if it looks like a signal object
          if (data.asset && data.signal) {
            setLastSignal(data);
          }
        } catch (e) {
          console.error('Failed to parse WS message:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WS Disconnected, reconnecting...');
        setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.error('WS Error:', error);
        ws.close();
      };

      socketRef.current = ws;
    };

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url]);

  return { lastSignal, isConnected };
};
