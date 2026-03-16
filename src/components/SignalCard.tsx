import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, MinusCircle, Radio } from 'lucide-react';
import type { Signal } from '../types';

interface SignalCardProps {
  signal: Signal | null;
  loading?: boolean;
}

const SignalCard: React.FC<SignalCardProps> = ({ signal, loading }) => {
  if (loading || !signal) {
    return (
      <div className="glass rounded-[32px] p-10 flex flex-col items-center justify-center min-h-[450px] border border-accent/10">
        <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-accent animate-spin"></div>
            <div className="absolute inset-4 rounded-full bg-white/5 flex items-center justify-center">
                <Radio className="text-white/20 animate-pulse" size={32} />
            </div>
        </div>
        <div className="h-10 w-48 bg-white/5 rounded-full mb-4 animate-pulse"></div>
        <div className="h-4 w-32 bg-white/5 rounded-full animate-pulse"></div>
      </div>
    );
  }

  const isUp = signal.signal === 'UP';
  const isDown = signal.signal === 'DOWN';

  return (
    <div className="glass rounded-[40px] p-10 flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden group border border-white/5">
      {/* Dynamic Background Glow */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[120px] transition-all duration-1000 ${isUp ? 'bg-up/20' : isDown ? 'bg-down/20' : 'bg-neutral/10'}`}></div>
      
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="mb-2 flex items-center gap-2">
            <Radio size={14} className={isUp ? 'text-up' : isDown ? 'text-down' : 'text-neutral'} />
            <span className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">AI Signal Analysis</span>
        </div>

        <div className={`mb-8 relative transition-all duration-700 ${isUp ? 'text-up' : isDown ? 'text-down' : 'text-neutral'}`}>
          <div className={`absolute inset-0 blur-3xl opacity-20 ${isUp ? 'bg-up' : isDown ? 'bg-down' : 'bg-neutral'}`}></div>
          {isUp ? <ArrowUpCircle size={140} strokeWidth={1.5} className="pulse-up" /> : isDown ? <ArrowDownCircle size={140} strokeWidth={1.5} className="pulse-down" /> : <MinusCircle size={140} strokeWidth={1.5} />}
        </div>

        <h2 className="text-6xl font-black mb-1 flex items-center gap-4 tracking-tighter">
          {signal.signal}
          <div className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase ${isUp ? 'border-up/30 text-up' : isDown ? 'border-down/30 text-down' : 'border-white/10 text-white/40'}`}>
            AI v3.0
          </div>
        </h2>

        <div className="flex flex-col items-center gap-3 mb-10">
          <p className="text-white/40 text-xs font-black uppercase tracking-widest">
            {signal.strength} STRENGTH <span className="mx-2 opacity-20">|</span> {signal.enhanced_confidence || signal.confidence}% Accuracy
            {signal.is_ai_enhanced && <span className="ml-2 text-accent">AI Enhanced</span>}
          </p>
          
          {/* AI Recommendation */}
          {signal.ai_recommendation && (
            <div className="text-accent text-xs font-bold uppercase tracking-widest">
              {signal.ai_recommendation}
            </div>
          )}
          
          {/* Advanced AI Model Type */}
          {signal.model_type && (
            <div className="text-white/60 text-xs uppercase tracking-widest">
              {signal.model_type}
            </div>
          )}
          
          {/* Neon Accuracy Bar */}
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(56,189,248,0.5)] ${isUp ? 'bg-up' : isDown ? 'bg-down' : 'bg-neutral'}`}
              style={{ width: `${signal.confidence}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/5 w-full rounded-2xl overflow-hidden border border-white/5">
          <div className="bg-surface/40 p-6 text-center">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-tighter mb-1">Entry Point</p>
            <p className="text-2xl font-mono font-black text-white/90">${signal.price.toFixed(5)}</p>
          </div>
          <div className="bg-surface/40 p-6 text-center">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-tighter mb-1">Risk Factor</p>
            <p className="text-2xl font-mono font-black text-white/90">{signal.risk_reward}</p>
          </div>
        </div>
        
        {/* AI Analysis Section */}
        {signal.ai_analysis && (
          <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-accent text-[10px] font-black uppercase tracking-widest mb-2">AI Analysis</p>
            <p className="text-white/60 text-xs leading-relaxed">{signal.ai_analysis}</p>
            
            {/* Models Used */}
            {signal.models_used && signal.models_used.length > 0 && (
              <div className="mt-3">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">AI Models Used</p>
                <div className="flex flex-wrap gap-1">
                  {signal.models_used.slice(0, 6).map((model, index) => (
                    <span key={index} className="text-[10px] px-2 py-1 bg-white/10 text-white/80 rounded-full">
                      {model}
                    </span>
                  ))}
                  {signal.models_used.length > 6 && (
                    <span className="text-[10px] px-2 py-1 bg-white/10 text-white/60 rounded-full">
                      +{signal.models_used.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {signal.ai_key_factors && signal.ai_key_factors.length > 0 && (
              <div className="mt-3">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Key Factors</p>
                <div className="flex flex-wrap gap-1">
                  {signal.ai_key_factors.map((factor, index) => (
                    <span key={index} className="text-[10px] px-2 py-1 bg-accent/20 text-accent rounded-full">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalCard;
