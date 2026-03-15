import React from 'react';
import type { AccuracyStats } from '../types';
import { ShieldCheck, TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

interface AccuracyDashboardProps {
    stats: AccuracyStats | null;
}

const AccuracyDashboard: React.FC<AccuracyDashboardProps> = ({ stats }) => {
    if (!stats || stats.total_trades === 0) {
        return (
            <div className="glass rounded-[32px] p-8 border border-white/5 bg-accent/5 mb-8 flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Activity className="text-accent animate-pulse" size={20} />
                </div>
                <div>
                    <h3 className="text-base font-black text-white mb-1">AI Performance Engine</h3>
                    <p className="text-white/40 text-xs font-bold">
                        {stats?.message ?? 'Trade and mark outcomes to see live accuracy metrics'}
                    </p>
                </div>
                <div className="ml-auto text-right shrink-0">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Accuracy</p>
                    <p className="text-2xl font-black text-white/20">--%</p>
                </div>
            </div>
        );
    }

    const metrics = [
        {
            label: 'Live Accuracy',
            value: `${stats.accuracy}%`,
            color: stats.accuracy >= 60 ? 'text-up' : 'text-down',
            icon: ShieldCheck,
            bg: stats.accuracy >= 60 ? 'bg-up/10' : 'bg-down/10',
        },
        {
            label: 'Total Trades',
            value: `${stats.total_trades}`,
            color: 'text-white',
            icon: Activity,
            bg: 'bg-white/5',
        },
        {
            label: 'Win / Loss',
            value: `${stats.wins} / ${stats.losses}`,
            color: stats.wins >= stats.losses ? 'text-up' : 'text-down',
            icon: stats.wins >= stats.losses ? TrendingUp : TrendingDown,
            bg: stats.wins >= stats.losses ? 'bg-up/10' : 'bg-down/10',
        },
        {
            label: 'Profit Factor',
            value: `${stats.profit_factor}x`,
            color: stats.profit_factor >= 1 ? 'text-accent' : 'text-down',
            icon: DollarSign,
            bg: 'bg-accent/10',
        },
        {
            label: 'Net P&L',
            value: `${stats.net_pnl >= 0 ? '+' : ''}$${stats.net_pnl}`,
            color: stats.net_pnl >= 0 ? 'text-up' : 'text-down',
            icon: DollarSign,
            bg: stats.net_pnl >= 0 ? 'bg-up/10' : 'bg-down/10',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {metrics.map((metric, i) => (
                <div
                    key={i}
                    className={`glass rounded-3xl p-5 border border-white/5 hover:border-white/10 transition-all group cursor-default ${metric.bg}`}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <metric.icon size={12} className="text-white/20 group-hover:text-white/40 transition-colors" />
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.25em] leading-none">
                            {metric.label}
                        </span>
                    </div>
                    <p className={`text-xl font-black tracking-tight font-mono ${metric.color}`}>
                        {metric.value}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default AccuracyDashboard;
