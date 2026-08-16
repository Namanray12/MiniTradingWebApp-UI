import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-14 bg-[#0e1320] border-b border-slate-800/80 px-6 flex items-center justify-end space-x-4 shrink-0">
      <button
        type="button"
        className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
      >
        <Bell className="w-4 h-4" />
      </button>

      <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-800">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-600/30">
          A
        </div>
        <span className="text-xs font-semibold text-slate-200">Admin</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
      </div>
    </header>
  );
};