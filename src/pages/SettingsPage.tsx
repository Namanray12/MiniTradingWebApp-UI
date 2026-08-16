import React from 'react';
import { APP_CONSTANTS } from '../constants/appConstants';

export const SettingsPage: React.FC = () => {
  return (
    <div className="bg-[#121829] border border-slate-800/90 rounded-2xl p-6 shadow-2xl space-y-6 max-w-2xl">
      <h2 className="text-base font-bold text-white tracking-wide border-b border-slate-800/60 pb-3">System Settings</h2>

      <div className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-400 font-semibold mb-1">Backend API URL</label>
          <input
            type="text"
            readOnly
            value={APP_CONSTANTS.API_BASE_URL}
            className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-slate-300"
          />
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">SignalR WebSocket Hub</label>
          <input
            type="text"
            readOnly
            value={APP_CONSTANTS.SIGNALR_HUB_URL}
            className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-slate-300"
          />
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">ActTrader External Gateway</label>
          <input
            type="text"
            readOnly
            value="http://s138.acttrader.com:10138"
            className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-slate-300"
          />
        </div>
      </div>
    </div>
  );
};