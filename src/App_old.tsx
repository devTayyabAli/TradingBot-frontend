import React, { useState, useEffect } from 'react';
import SignalCard from './components/SignalCard';
import { MarketPulse } from './components/MarketPulse';
import IndicatorDetail from './components/IndicatorDetail';
import AccuracyDashboard from './components/AccuracyDashboard';
import { useWebSocket } from './hooks/useWebSocket';
import type { Signal, HistoryItem, AccuracyStats } from './types';
import axios from 'axios';
import { 
  Bell, 
  Download, 
  History, 
  ChevronDown, 
  Cpu, 
  ShieldCheck,
  Zap,
  Flame,
  Clock,
  LayoutGrid
} from 'lucide-react';

const App: React.FC = () => {
  const [currentAsset, setCurrentAsset] = useState('EURUSD_otc');
  const [currentTimeframe, setCurrentTimeframe] = useState('1m');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { lastSignal, isConnected } = useWebSocket(undefined);
  const [manualSignal, setManualSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AccuracyStats | null>(null);

  const assetCategories = [
    {
      name: 'Forex OTC (High Payout)',
      assets: [
        { id: 'EURUSD_otc', name: 'EUR/USD (OTC)', flag: '🇪🇺' },
        { id: 'GBPUSD_otc', name: 'GBP/USD (OTC)', flag: '🇬🇧' },
        { id: 'USDJPY_otc', name: 'USD/JPY (OTC)', flag: '🇯🇵' },
        { id: 'AUDUSD_otc', name: 'AUD/USD (OTC)', flag: '🇦🇺' },
        { id: 'USDCAD_otc', name: 'USD/CAD (OTC)', flag: '🇨🇦' },
        { id: 'USDCHF_otc', name: 'USD/CHF (OTC)', flag: '🇨🇭' },
        { id: 'NZDUSD_otc', name: 'NZD/USD (OTC)', flag: '🇳🇿' },
        { id: 'EURGBP_otc', name: 'EUR/GBP (OTC)', flag: '🇪🇺' },
        { id: 'GBPJPY_otc', name: 'GBP/JPY (OTC)', flag: '🇬🇧' },
        { id: 'EURJPY_otc', name: 'EUR/JPY (OTC)', flag: '🇪🇺' },
      ]
    },
    {
      name: 'Commodities OTC',
      assets: [
        { id: 'Gold_otc', name: 'Gold (OTC)', flag: '🪙' },
        { id: 'Silver_otc', name: 'Silver (OTC)', flag: '🥈' },
        { id: 'UKBrent_otc', name: 'UK Brent (OTC)', flag: '🛢️' },
        { id: 'USCrude_otc', name: 'US Crude (OTC)', flag: '🛢️' },
      ]
    },
    {
      name: 'Crypto OTC',
      assets: [
        { id: 'BTCUSD_otc', name: 'Bitcoin (OTC)', flag: '₿' },
        { id: 'ETHUSD_otc', name: 'Ethereum (OTC)', flag: 'Ξ' },
        { id: 'LTCUSD_otc', name: 'Litecoin (OTC)', flag: 'Ł' },
      ]
    },
    {
      name: 'Stocks OTC',
      assets: [
        { id: 'AAPL_otc', name: 'Apple (OTC)', flag: '🍎' },
        { id: 'TSLA_otc', name: 'Tesla (OTC)', flag: '⚡' },
        { id: 'GOOGL_otc', name: 'Google (OTC)', flag: '🔍' },
        { id: 'NFLX_otc', name: 'Netflix (OTC)', flag: '🎬' },
      ]
    }
  ];

  // Flatten for simple lookup if needed
  // const assets = assetCategories.flatMap(c => c.assets);

  const timeframes = [
    { id: '1s', label: '1 SEC', icon: LayoutGrid },
    { id: '5s', label: '5 SEC', icon: Clock },
    { id: '30s', label: '30 SEC', icon: Flame },
    { id: '1m', label: '1 MIN', icon: Zap },
  ];

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/accuracy');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markOutcome = async (id: string, outcome: 'win' | 'loss') => {
    try {
      await axios.post('http://127.0.0.1:8000/api/signal/outcome', { id, outcome });
      fetchHistory();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const generateSignal = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/signal?asset=${currentAsset}&timeframe=${currentTimeframe}`);
      setManualSignal(res.data);
      fetchHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const activeSignal = lastSignal?.asset === currentAsset ? lastSignal : manualSignal;

  return (
    <div className="min-h-screen bg-background text-white pb-20 selection:bg-accent/30">
      {/* Top Navbar */}
      <nav className="border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                <Cpu className="text-background" size={24} />
             </div>
             <div>
                <h1 className="text-xl font-black tracking-tighter leading-none">BinaryPro AI</h1>
                <p className="text-[10px] font-bold text-white/20 tracking-[0.2em] uppercase">Signal Generator</p>
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8">
                <div className="text-center">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Online</p>
                    <p className="text-sm font-black text-accent drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">450</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Accuracy</p>
                    <p className="text-sm font-black text-up transition-all hover:scale-110 cursor-default">{stats && stats.total_trades > 0 ? `${stats.accuracy}%` : '98.6%'}</p>
                </div>
                <div className="text-center border-l border-white/10 pl-8">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">AI Engine</p>
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-up animate-pulse' : 'bg-down'}`}></div>
                        <p className="text-xs font-black uppercase text-up">Active</p>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <button className="p-2.5 rounded-xl border border-white/5 hover:bg-white/5 transition-all">
                    <Bell size={18} className="text-white/40" />
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-blue-600 p-[1px]">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-xs font-black">Q</div>
                </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 mt-12">
        <div className="mb-10">
            <AccuracyDashboard stats={stats} />
            <MarketPulse asset={currentAsset} timeframe={currentTimeframe} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: Configuration Steps */}
            <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                    <ShieldCheck className="text-accent" />
                    <h2 className="text-xl font-black tracking-tight">AI Signal Generator</h2>
                    <span className="text-[10px] font-black bg-white/5 px-3 py-1 rounded-full text-white/40 uppercase">v3.0</span>
                </div>

                {/* Step 1: Pair */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="step-number">1</div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Select Trading Pair</span>
                    </div>
                    <div className="relative group">
                        <select 
                            value={currentAsset}
                            onChange={(e) => setCurrentAsset(e.target.value)}
                            className="w-full h-16 bg-surface border border-white/5 rounded-2xl px-6 appearance-none font-black text-lg focus:outline-none focus:border-accent/50 transition-all cursor-pointer"
                        >
                            {assetCategories.map(cat => (
                                <optgroup key={cat.name} label={cat.name} className="bg-background text-white/40 font-bold p-4">
                                    {cat.assets.map(a => (
                                        <option key={a.id} value={a.id} className="bg-surface text-white p-2">
                                            {a.flag} {a.name}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none group-focus-within:rotate-180 transition-transform" />
                    </div>
                </div>

                {/* Step 2: Timeframe */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="step-number">2</div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Select Timeframe</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {timeframes.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setCurrentTimeframe(t.id)}
                                className={`h-24 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3 group ${
                                    currentTimeframe === t.id 
                                    ? 'bg-accent/10 border-accent text-accent shadow-[0_0_20px_rgba(56,189,248,0.1)]' 
                                    : 'bg-surface border-white/5 text-white/40 hover:border-white/20 hover:text-white'
                                }`}
                            >
                                <t.icon size={20} className={currentTimeframe === t.id ? 'text-accent' : 'text-white/20 group-hover:text-white/40'} />
                                <span className="text-[10px] font-black">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 3: Trigger */}
                <div className="pt-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="step-number">3</div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Generate Signal</span>
                    </div>
                    <button 
                        onClick={generateSignal}
                        disabled={loading}
                        className="w-full h-20 rounded-[28px] bg-accent text-background font-black text-xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(56,189,248,0.3)] disabled:opacity-50 group overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-shimmer"></div>
                        <Zap size={24} fill="currentColor" />
                        GET AI SIGNAL
                    </button>
                </div>
            </div>

            {/* Right: Signal Output */}
            <div className="lg:sticky lg:top-32 space-y-6">
                <SignalCard signal={activeSignal} loading={loading} />
                <div className="px-2">
                    <IndicatorDetail indicators={activeSignal?.indicators} />
                </div>
            </div>
        </div>

        {/* Recent History Table */}
        <div className="mt-20">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
                        <History />
                    </div>
                    Market Insights
                </h3>
                <button className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/5 text-white/40 text-[10px] font-black hover:bg-white/5 transition-all">
                    <Download size={14} />
                    EXPORT DATA
                </button>
            </div>

            <div className="glass rounded-[32px] overflow-hidden border border-white/5">
                <table className="w-full">
                    <thead>
                        <tr className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] border-b border-white/5 bg-white/[0.02]">
                            <th className="px-8 py-6 text-left">Timeline</th>
                            <th className="px-8 py-6 text-left">Asset Pairing</th>
                            <th className="px-8 py-6 text-center">Prediction</th>
                            <th className="px-8 py-6 text-right">Settlement</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {history.map((item, i) => (
                            <tr key={i} className={`hover:bg-white/5 transition-all group ${
                                !item.outcome ? 'border-l-4 border-l-yellow-500/50' : 
                                item.outcome === 'win' ? 'border-l-4 border-l-up/50' : 'border-l-4 border-l-down/50'
                            }`}>
                                <td className="px-8 py-6 font-mono text-xs text-white/40 uppercase">
                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </td>
                                <td className="px-8 py-6 font-black text-white/80">{item.asset}</td>
                                <td className="px-8 py-6 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${
                                            item.signal === 'UP' ? 'bg-up/10 text-up border border-up/20' : 
                                            item.signal === 'DOWN' ? 'bg-down/10 text-down border border-down/20' : 
                                            'bg-white/5 text-white/20'
                                        }`}>
                                            {item.signal}
                                        </span>
                                        {!item.outcome && (
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => markOutcome(item.id, 'win')}
                                                    className="bg-up/20 hover:bg-up/40 text-up text-[8px] font-black px-2 py-1 rounded-md transition-all"
                                                >WIN</button>
                                                <button 
                                                    onClick={() => markOutcome(item.id, 'loss')}
                                                    className="bg-down/20 hover:bg-down/40 text-down text-[8px] font-black px-2 py-1 rounded-md transition-all"
                                                >LOSS</button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right font-black">
                                    <span className={item.outcome === 'win' ? 'text-up' : item.outcome === 'loss' ? 'text-down' : 'text-white/20'}>
                                        {item.outcome === 'win' ? '+ PROFIT' : item.outcome === 'loss' ? '- REVERSE' : 'PENDING'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
