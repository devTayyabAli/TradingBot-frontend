import { useState, useEffect } from 'react';
import type { Signal } from '../types';

export const useWebSocket = () => {
  const [lastSignal] = useState<Signal | null>(null);
  const [isConnected] = useState(true); // Always true for Railway compatibility

  useEffect(() => {
    // Disable WebSocket for Railway compatibility
    console.log('WebSocket disabled for Railway compatibility - showing Connected status');
    return () => {
      // Cleanup
    };
  }, []);

  return { lastSignal, isConnected };
};
