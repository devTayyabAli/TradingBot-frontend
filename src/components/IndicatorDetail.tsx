import React from 'react';
import type { Signal } from '../types';

interface IndicatorDetailProps {
    indicators: Signal['indicators'] | undefined;
}

const IndicatorDetail: React.FC<IndicatorDetailProps> = ({ indicators }) => {
    if (!indicators) return null;

    const data = [
        { label: 'RSI (14)', value: indicators.rsi, desc: indicators.rsi > 70 ? 'Overbought' : indicators.rsi < 30 ? 'Oversold' : 'Neutral' },
        { label: 'MACD', value: indicators.macd, desc: indicators.macd > 0 ? 'Bullish' : 'Bearish' },
        { label: 'EMA Trend', value: indicators.ema9 > indicators.ema21 ? 'Uptrend' : 'Downtrend', desc: 'Short-term' },
        { label: 'Stoch K', value: indicators.stoch_k, desc: indicators.stoch_k > 80 ? 'Heavy' : 'Light' },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 mt-6">
            {data.map((item, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 transition-all hover:bg-white/[0.05]">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{item.label}</p>
                    <div className="flex justify-between items-end">
                        <span className="text-lg font-black text-white/90 font-mono tracking-tighter">{item.value}</span>
                        <span className={`text-[10px] font-bold uppercase ${
                            item.desc.includes('Bullish') || item.desc.includes('Uptrend') || item.desc === 'Oversold' ? 'text-up' :
                            item.desc.includes('Bearish') || item.desc.includes('Downtrend') || item.desc === 'Overbought' ? 'text-down' :
                            'text-white/40'
                        }`}>
                            {item.desc}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default IndicatorDetail;
