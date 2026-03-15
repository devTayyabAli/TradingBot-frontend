export interface Signal {
  asset: string;
  timeframe: string;
  signal: 'UP' | 'DOWN' | 'NEUTRAL';
  confidence: number;
  strength: 'STRONG' | 'MODERATE' | 'WEAK';
  price: number;
  stop_loss: number;
  take_profit: number;
  risk_reward: number;
  timestamp: string;
  indicators: {
    rsi: number;
    macd: number;
    ema9: number;
    ema21: number;
    ema50: number;
    bb_upper: number;
    bb_lower: number;
    stoch_k: number;
    stoch_d: number;
  };
}

// HistoryItem now reflects what SignalTracker saves to signals.json
export interface HistoryItem {
  id: string;
  timestamp: string;
  asset: string;
  signal: 'UP' | 'DOWN' | 'NEUTRAL';
  price: number;
  confidence: number;
  outcome: 'win' | 'loss' | null;
}

export interface AccuracyStats {
  accuracy: number;
  total_trades: number;
  wins: number;
  losses: number;
  profit_factor: number;
  net_pnl: number;
  message?: string;
}

export interface Settings {
  rsi_period: number;
  macd_fast: number;
  macd_slow: number;
  macd_signal: number;
  ema_fast: number;
  ema_medium: number;
  ema_slow: number;
  stoch_k: number;
  stoch_d: number;
  bb_period: number;
  bb_std: number;
}
