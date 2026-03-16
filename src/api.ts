const API_BASE_URL = 'https://tradingbot-production-cd27.up.railway.app';

export const api = {
  signal: (asset: string, timeframe: string) => 
    `${API_BASE_URL}/api/signal?asset=${asset}&timeframe=${timeframe}`,
  accuracy: () => `${API_BASE_URL}/api/accuracy`,
  notifications: () => `${API_BASE_URL}/api/notifications`,
  emailStatus: () => `${API_BASE_URL}/api/email/status`,
  emailConfigure: () => `${API_BASE_URL}/api/email/configure`,
  emailTest: () => `${API_BASE_URL}/api/email/test`,
  chart: (asset: string, timeframe: string) => 
    `${API_BASE_URL}/api/chart?asset=${asset}&timeframe=${timeframe}`,
  history: () => `${API_BASE_URL}/api/history`,
  assets: () => `${API_BASE_URL}/api/assets`,
  sentiment: (asset: string) => `${API_BASE_URL}/api/sentiment/${asset}`,
  accuracy75: () => `${API_BASE_URL}/api/accuracy-75`,
  websocket: 'wss://tradingbot-production-cd27.up.railway.app/ws'
};
