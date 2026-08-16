import React from 'react';
import { LayoutDashboard, History, Briefcase, Settings, Activity } from 'lucide-react';
import { APP_CONSTANTS } from '../constants/appConstants';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  wsStatus: string;
  serverTime: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  wsStatus,
  serverTime,
}) => {
  const isConnected = wsStatus === APP_CONSTANTS.STATUS.CONNECTED;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'Trade History', icon: History },
    { id: 'positions', label: 'Positions', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0e1320] border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0 select-none">
      <div className="space-y-6">
        <div className="flex items-center space-x-3 px-2 pt-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide leading-tight">Mini Trading</h1>
            <p className="text-xs text-slate-400 font-medium">Platform</p>
          </div>
        </div>

        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center space-x-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="bg-[#141b2d] border border-slate-800/90 rounded-xl p-3.5 space-y-2.5 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
          <span className={`font-bold tracking-wider ${isConnected ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isConnected ? 'CONNECTED' : wsStatus || 'DISCONNECTED'}
          </span>
        </div>

        <div className="space-y-1 text-[11px] text-slate-400 font-sans border-t border-slate-800/80 pt-2">
          <div className="flex justify-between">
            <span>WebSocket:</span>
            <span className="text-slate-200 font-mono">{isConnected ? 'Connected' : 'Error'}</span>
          </div>
          <div className="flex justify-between">
            <span>Prices:</span>
            <span className="text-slate-200 font-mono">{isConnected ? 'Streaming' : 'Paused'}</span>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-2 text-[10px] text-slate-500 font-sans">
          <span className="block text-slate-400">Server Time:</span>
          <span className="font-mono text-slate-300 font-medium">
            {serverTime ? new Date(serverTime).toLocaleString() : '--:--:--'}
          </span>
        </div>
      </div>
    </aside>
  );
};