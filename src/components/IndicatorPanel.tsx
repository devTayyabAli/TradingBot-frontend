import React from 'react';
import type { Signal } from '../types';
import { Activity, Percent, TrendingUp, Layers, Cpu } from 'lucide-react';

interface IndicatorPanelProps {
  signal: Signal | null;
}

const IndicatorPanel: React.FC<IndicatorPanelProps> = ({ signal }) => {
  if (!signal) return null;

  const { indicators } = signal;

  const metrics = [
    { label: 'RSI (14)', value: indicators.rsi, icon: <Activity size={16} />, status: indicators.rsi > 70 ? 'Overbought' : indicators.rsi < 30 ? 'Oversold' : 'Neutral' },
    { label: 'MACD', value: indicators.macd, icon: <TrendingUp size={16} />, status: indicators.macd > 0 ? 'Bullish' : 'Bearish' },
    { label: 'Stochastic', value: `${indicators.stoch_k} / ${indicators.stoch_d}`, icon: <Percent size={16} />, status: indicators.stoch_k > 80 ? 'Overbought' : 'Neutral' },
    { label: 'BB Position', value: 'Inside', icon: <Layers size={16} />, status: 'Stable' },
  ];

  return (
    <div className="glass rounded-3xl p-6 h-full">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        <Cpu size={20} className="text-up" />
        Technical Analysis
      </h3>

      <div className="space-y-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-3">
              <div className="text-white/40">{m.icon}</div>
              <div>
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-tight">{m.label}</p>
                <p className="text-sm font-mono font-bold">{m.value}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
              m.status === 'Bullish' || m.status === 'Oversold' ? 'bg-up/20 text-up' : 
              m.status === 'Bearish' || m.status === 'Overbought' ? 'bg-down/20 text-down' : 
              'bg-white/10 text-white/40'
            }`}>
              {m.status}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/40">Market Trend</span>
          <span className="text-up font-bold">Strong Bullish</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/40">Volatility</span>
          <span className="text-white/80">Low (ATR: 0.0012)</span>
        </div>
      </div>
    </div>
  );
};

export default IndicatorPanel;
