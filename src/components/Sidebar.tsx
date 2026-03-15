import React from 'react';
import { LayoutDashboard, History, Settings, LogOut, TrendingUp, Cpu, Activity, Zap } from 'lucide-react';

interface SidebarProps {
  currentAsset: string;
  onAssetChange: (asset: string) => void;
}

const assets = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "BTCUSD", "ETHUSD", "XAUUSD"];

const Sidebar: React.FC<SidebarProps> = ({ currentAsset, onAssetChange }) => {
  return (
    <div className="w-72 h-screen glass border-r-0 flex flex-col p-6 fixed left-0 top-0">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="bg-up p-2 rounded-xl">
          <Zap size={24} className="text-black" />
        </div>
        <h1 className="text-xl font-black tracking-tight">QUOTEX<span className="text-up">PRO</span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        <div className="text-white/20 text-[10px] uppercase font-bold tracking-widest mb-4 px-2">Main Menu</div>
        
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-up/10 text-up font-bold">
          <LayoutDashboard size={20} />
          Dashboard
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/40 hover:bg-white/5 transition-colors">
          <History size={20} />
          Signal History
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/40 hover:bg-white/5 transition-colors">
          <Settings size={20} />
          Parameters
        </a>

        <div className="pt-8">
          <div className="text-white/20 text-[10px] uppercase font-bold tracking-widest mb-4 px-2">Assets</div>
          <div className="grid grid-cols-1 gap-1">
            {assets.map(asset => (
              <button
                key={asset}
                onClick={() => onAssetChange(asset)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                  currentAsset === asset ? 'bg-white/10 text-white font-bold' : 'text-white/40 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${currentAsset === asset ? 'bg-up' : 'bg-white/10'}`}></div>
                  {asset}
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/40 hover:text-white transition-colors w-full">
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
