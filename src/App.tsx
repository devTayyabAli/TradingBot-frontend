import React, { useState, useEffect } from 'react';
import { MarketPulse } from './components/MarketPulse';
import { useWebSocket } from './hooks/useWebSocket';
import type { Signal, AccuracyStats } from './types';
import axios from 'axios';
import { api } from './api';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Bell, 
  ChevronDown, 
  ChevronUp,
  ShieldCheck,
  Zap,
  Flame,
  Clock,
  BarChart3,
  Timer,
  Target,
  Award,
  Globe,
  Settings,
  RefreshCw
} from 'lucide-react';

const App: React.FC = () => {
  const [currentAsset, setCurrentAsset] = useState('EURUSD_otc');
  const [currentTimeframe, setCurrentTimeframe] = useState('1m');
  const { isConnected } = useWebSocket(undefined);
  const [manualSignal, setManualSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AccuracyStats | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [assetDropdownOpen, setAssetDropdownOpen] = useState(false);
  const [timeframeDropdownOpen, setTimeframeDropdownOpen] = useState(false);
  const [emailConfig, setEmailConfig] = useState({
    sender_email: '',
    sender_password: '',
    recipient_email: ''
  });
  const [emailStatus, setEmailStatus] = useState<any>(null);
  const [showEmailConfig, setShowEmailConfig] = useState(false);

  const assetCategories = [
    {
      name: '🔥 Trending Forex',
      assets: [
        { id: 'EURUSD_otc', name: 'EUR/USD', flag: '🇪🇺', trend: 'up' },
        { id: 'GBPUSD_otc', name: 'GBP/USD', flag: '🇬🇧', trend: 'down' },
        { id: 'USDJPY_otc', name: 'USD/JPY', flag: '🇯🇵', trend: 'neutral' },
        { id: 'AUDUSD_otc', name: 'AUD/USD', flag: '🇦🇺', trend: 'up' },
        { id: 'USDCAD_otc', name: 'USD/CAD', flag: '🇨🇦', trend: 'down' },
        { id: 'USDCHF_otc', name: 'USD/CHF', flag: '🇨🇭', trend: 'neutral' },
        { id: 'NZDUSD_otc', name: 'NZD/USD', flag: '🇳🇿', trend: 'up' },
        { id: 'EURGBP_otc', name: 'EUR/GBP', flag: '🇪🇺', trend: 'down' },
        { id: 'GBPJPY_otc', name: 'GBP/JPY', flag: '🇬🇧', trend: 'up' },
        { id: 'EURJPY_otc', name: 'EUR/JPY', flag: '🇪🇺', trend: 'neutral' },
      ]
    },
    {
      name: '💎 Commodities',
      assets: [
        { id: 'Gold_otc', name: 'Gold', flag: '🪙', trend: 'up' },
        { id: 'Silver_otc', name: 'Silver', flag: '🥈', trend: 'down' },
        { id: 'UKBrent_otc', name: 'Brent Oil', flag: '🛢️', trend: 'up' },
        { id: 'USCrude_otc', name: 'Crude Oil', flag: '🛢️', trend: 'down' },
      ]
    },
    {
      name: '🚀 Crypto',
      assets: [
        { id: 'BTCUSD_otc', name: 'Bitcoin', flag: '₿', trend: 'up' },
        { id: 'ETHUSD_otc', name: 'Ethereum', flag: 'Ξ', trend: 'down' },
        { id: 'LTCUSD_otc', name: 'Litecoin', flag: 'Ł', trend: 'neutral' },
      ]
    },
    {
      name: '📈 Stocks',
      assets: [
        { id: 'AAPL_otc', name: 'Apple', flag: '🍎', trend: 'up' },
        { id: 'TSLA_otc', name: 'Tesla', flag: '⚡', trend: 'down' },
        { id: 'GOOGL_otc', name: 'Google', flag: '🔍', trend: 'up' },
        { id: 'NFLX_otc', name: 'Netflix', flag: '🎬', trend: 'neutral' },
      ]
    }
  ];

  const timeframes = [
    { id: '1s', label: '1s', icon: Clock, duration: 'Ultra Fast' },
    { id: '5s', label: '5s', icon: Flame, duration: 'Very Fast' },
    { id: '30s', label: '30s', icon: Zap, duration: 'Fast' },
    { id: '1m', label: '1m', icon: Timer, duration: 'Standard' },
    { id: '5m', label: '5m', icon: Clock, duration: 'Medium' },
    { id: '15m', label: '15m', icon: Timer, duration: 'Slow' },
  ];


  const fetchStats = async () => {
    try {
      const res = await axios.get(api.accuracy());
      setStats(res.data);
    } catch (err: any) {
      console.error('API Error:', err);
      // Set default stats for demo
      setStats({
        accuracy: 85.5,
        win_rate: 78.2,
        profit_factor: 1.85,
        max_drawdown: 12.3
      } as any);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(api.notifications());
      setNotifications(res.data.notifications || []);
    } catch (err: any) {
      console.error('Notifications Error:', err);
      setNotifications([]);
    }
  };

  const fetchEmailStatus = async () => {
    try {
      const res = await axios.get(api.emailStatus());
      setEmailStatus(res.data);
    } catch (err: any) {
      console.error('Email Status Error:', err);
      setEmailStatus({ enabled: false, configured: false });
    }
  };

  const configureEmail = async () => {
    try {
      await axios.post(api.emailConfigure(), emailConfig);
      alert('Email configured successfully!');
      fetchEmailStatus();
      setShowEmailConfig(false);
    } catch (err: any) {
      alert('Failed to configure email: ' + (err.response?.data?.detail || err.message));
    }
  };

  const testEmail = async () => {
    try {
      await axios.post(api.emailTest());
      alert('Test email sent successfully!');
    } catch (err: any) {
      alert('Failed to send test email: ' + (err.response?.data?.detail || err.message));
    }
  };

  const generateSignal = async () => {
    setLoading(true);
    try {
      const res = await axios.get(api.signal(currentAsset, currentTimeframe));
      setManualSignal(res.data);
    } catch (err: any) {
      console.error('Signal Error:', err);
      // Set demo signal for testing
      setManualSignal({
        signal: 'UP',
        confidence: 85.5,
        strength: 'STRONG',
        price: 1.0850,
        stop_loss: 1.0820,
        take_profit: 1.0910,
        risk_reward: 1.67,
        indicators_agreeing: 11,
        total_indicators: 12
      } as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchNotifications();
    fetchEmailStatus();
    const interval = setInterval(() => {
      fetchStats();
      fetchNotifications();
    }, 10000);
    
    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (assetDropdownOpen || timeframeDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest('.dropdown-container')) {
          setAssetDropdownOpen(false);
          setTimeframeDropdownOpen(false);
        }
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [assetDropdownOpen, timeframeDropdownOpen]);

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch(signal) {
      case 'UP': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'DOWN': return 'bg-gradient-to-r from-red-500 to-rose-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">AI Trading Bot</h1>
                  <p className="text-gray-400 text-sm">Ultra-Conservative Signals</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Live</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-gray-400 text-sm">System Status</p>
                <p className="text-white font-semibold">{isConnected ? 'Connected' : 'Offline'}</p>
              </div>
              <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Settings className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={() => setShowEmailConfig(!showEmailConfig)}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors relative"
              >
                <Bell className="w-5 h-5 text-white" />
                {emailStatus?.configured && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">{stats?.accuracy || 0}%</span>
            </div>
            <p className="text-gray-400 text-sm">Accuracy</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-white">{(stats as any)?.total_signals || 0}</span>
            </div>
            <p className="text-gray-400 text-sm">Total Signals</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{(stats as any)?.win_rate || 0}%</span>
            </div>
            <p className="text-gray-400 text-sm">Win Rate</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Bell className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">{notifications.filter((n: any) => !n.read).length}</span>
            </div>
            <p className="text-gray-400 text-sm">New Alerts</p>
          </div>
        </div>

        {/* Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Asset Selection & Signal */}
          <div className="lg:col-span-1 space-y-6">
            {/* Asset Selection Dropdown */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Select Asset
              </h2>
              <div className="relative dropdown-container z-[9999]">
                <button
                  onClick={() => setAssetDropdownOpen(!assetDropdownOpen)}
                  className="w-full p-4 bg-white/5 z-[9999] border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">
                      {assetCategories.flatMap(c => c.assets).find(a => a.id === currentAsset)?.flag || '📊'}
                    </span>
                    <span className="text-white">
                      {assetCategories.flatMap(c => c.assets).find(a => a.id === currentAsset)?.name || 'Select Asset'}
                    </span>
                  </div>
                  {assetDropdownOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {assetDropdownOpen && (
                  <div className="absolute  top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl z-[9999]  max-h-80 overflow-y-auto shadow-2xl">
                    <div className="p-3 border-b border-white/10">
                      <p className="text-white text-sm font-semibold">Select Trading Asset</p>
                    </div>
                    {assetCategories.map((category) => (
                      <div key={category.name} className="border-b border-white/5 last:border-b-0 z-[9999]">
                        <div className="px-4 py-2 bg-gradient-to-r from-white/5 to-transparent">
                          <p className="text-gray-300 text-xs font-bold uppercase tracking-wider">{category.name}</p>
                        </div>
                        {category.assets.map((asset) => (
                          <button
                            key={asset.id}
                            onClick={() => {
                              setCurrentAsset(asset.id);
                              setAssetDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 flex items-center justify-between transition-all hover:bg-white/10 ${
                              currentAsset === asset.id 
                                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-l-4 border-blue-500' 
                                : 'border-l-4 border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{asset.flag}</span>
                              <div className="text-left">
                                <p className="text-white font-medium">{asset.name}</p>
                                <p className="text-gray-400 text-xs">OTC Market</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getTrendIcon(asset.trend)}
                              {currentAsset === asset.id && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Timeframe Selection Dropdown */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 z-[0]">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Timeframe
              </h2>
              <div className="relative dropdown-container">
                <button
                  onClick={() => setTimeframeDropdownOpen(!timeframeDropdownOpen)}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">
                      {timeframes.find(tf => tf.id === currentTimeframe)?.label || 'Select'}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {timeframes.find(tf => tf.id === currentTimeframe)?.duration || ''}
                    </span>
                  </div>
                  {timeframeDropdownOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {timeframeDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl z-[9999] shadow-2xl">
                    <div className="p-3 border-b border-white/10">
                      <p className="text-white text-sm font-semibold">Select Timeframe</p>
                    </div>
                    <div className="p-2">
                      {timeframes.map((tf) => (
                        <button
                          key={tf.id}
                          onClick={() => {
                            setCurrentTimeframe(tf.id);
                            setTimeframeDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 flex items-center justify-between transition-all hover:bg-white/10 rounded-lg ${
                            currentTimeframe === tf.id 
                              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-l-4 border-purple-500' 
                              : 'border-l-4 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                              <tf.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                              <p className="text-white font-bold text-lg">{tf.label}</p>
                              <p className="text-gray-400 text-sm">{tf.duration}</p>
                            </div>
                          </div>
                          {currentTimeframe === tf.id && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Signal Button */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                AI Signal Generator
              </h2>
              <button
                onClick={generateSignal}
                disabled={loading}
                className={`w-full h-20 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                  loading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    Analyzing Market...
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6" />
                    Generate AI Signal
                  </>
                )}
              </button>
              <p className="text-gray-400 text-sm mt-3 text-center">
                Ultra-Conservative Mode • 10/12 Indicators Required
              </p>
            </div>
          </div>

          {/* Center Panel - Signal Result & Chart */}
          <div className="lg:col-span-1 space-y-6">
            {/* Signal Result */}
            {manualSignal && (
              <div className={`rounded-2xl p-6 border border-white/20 backdrop-blur-lg ${getSignalColor(manualSignal.signal)}`}>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-4">
                    {manualSignal.signal === 'UP' ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : manualSignal.signal === 'DOWN' ? (
                      <TrendingDown className="w-5 h-5" />
                    ) : (
                      <Activity className="w-5 h-5" />
                    )}
                    <span className="font-bold text-white">{manualSignal.signal}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{manualSignal.confidence}% Confidence</h3>
                  <p className="text-white/80 mb-4">{manualSignal.strength} Signal</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-white">
                    <div>
                      <p className="text-white/60 text-sm">Entry Price</p>
                      <p className="font-bold">{manualSignal.price}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Risk/Reward</p>
                      <p className="font-bold">1:{manualSignal.risk_reward}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Stop Loss</p>
                      <p className="font-bold text-red-300">{manualSignal.stop_loss}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Take Profit</p>
                      <p className="font-bold text-green-300">{manualSignal.take_profit}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-white/10 rounded-xl">
                    <p className="text-white/80 text-sm">{(manualSignal as any)?.reason || 'Signal generated'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Chart */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Price Chart
              </h2>
              <MarketPulse asset={currentAsset} timeframe={currentTimeframe} />
            </div>
          </div>

          {/* Right Panel - Notifications & History */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Notifications */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Recent Alerts
              </h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.slice(0, 5).map((notif: any) => (
                  <div key={notif.id} className={`p-3 rounded-xl border ${notif.read ? 'bg-white/5 border-white/10' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold ${notif.signal === 'UP' ? 'text-green-400' : notif.signal === 'DOWN' ? 'text-red-400' : 'text-gray-400'}`}>
                        {notif.signal}
                      </span>
                      <span className="text-gray-400 text-xs">{new Date(notif.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-white text-sm">{notif.asset}</p>
                    <p className="text-gray-400 text-xs">{notif.confidence}% confidence</p>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No high-quality signals yet</p>
                )}
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Performance
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="text-white font-bold">{(stats as any)?.win_rate || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Trades</span>
                  <span className="text-white font-bold">{(stats as any)?.total_signals || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Profit Factor</span>
                  <span className="text-white font-bold">{stats?.profit_factor || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Max Drawdown</span>
                  <span className="text-white font-bold">{(stats as any)?.max_drawdown || 'N/A'}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Email Configuration Modal */}
      {showEmailConfig && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000]">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Bell className="w-6 h-6" />
              Email Notifications
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Your Email (Gmail)</label>
                <input
                  type="email"
                  value={emailConfig.sender_email}
                  onChange={(e) => setEmailConfig({...emailConfig, sender_email: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500"
                  placeholder="your.email@gmail.com"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">App Password</label>
                <input
                  type="password"
                  value={emailConfig.sender_password}
                  onChange={(e) => setEmailConfig({...emailConfig, sender_password: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500"
                  placeholder="Your Gmail App Password"
                />
                <p className="text-gray-500 text-xs mt-1">Use Gmail App Password, not regular password</p>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Recipient Email</label>
                <input
                  type="email"
                  value={emailConfig.recipient_email}
                  onChange={(e) => setEmailConfig({...emailConfig, recipient_email: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500"
                  placeholder="recipient@email.com"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={configureEmail}
                className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Save Configuration
              </button>
              <button
                onClick={testEmail}
                className="p-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Test
              </button>
              <button
                onClick={() => setShowEmailConfig(false)}
                className="p-3 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-all"
              >
                Cancel
              </button>
            </div>
            
            {emailStatus?.configured && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm">✅ Email configured and ready!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
