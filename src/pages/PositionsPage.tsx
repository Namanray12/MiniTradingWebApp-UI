import React from 'react';
import type { Position } from '../types/trading';

interface PositionsPageProps {
  positions: Position[];
}

export const PositionsPage: React.FC<PositionsPageProps> = ({ positions }) => {
  const totalUnrealizedPnL = positions.reduce((sum, p) => sum + p.unrealizedPnL, 0);

  return (
    <div className="space-y-5">
      <div className="bg-[#121829] border border-slate-800/90 rounded-2xl p-6 shadow-2xl space-y-4">
        <h2 className="text-base font-bold text-white tracking-wide pb-3 border-b border-slate-800/60">Positions Summary</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 font-semibold border-b border-slate-800/80 pb-2">
              <tr>
                <th className="py-3 px-4">Symbol</th>
                <th className="py-3 px-4 text-right">Net Position</th>
                <th className="py-3 px-4 text-right">Avg Price</th>
                <th className="py-3 px-4 text-right">Current Price</th>
                <th className="py-3 px-4 text-right">P/L</th>
                <th className="py-3 px-4 text-right">P/L %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-mono">
              {positions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No open positions recorded.
                  </td>
                </tr>
              ) : (
                positions.map((pos) => {
                  const isProfitable = pos.unrealizedPnL >= 0;

                  return (
                    <tr key={pos.symbol} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-sans font-bold text-white">{pos.symbol}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-200">{pos.netQuantity.toFixed(2)}</td>
                      <td className="py-3.5 px-4 text-right text-slate-300">{pos.averagePrice.toFixed(pos.averagePrice < 10 ? 5 : 2)}</td>
                      <td className="py-3.5 px-4 text-right text-white font-bold">{pos.currentPrice.toFixed(pos.currentPrice < 10 ? 5 : 2)}</td>
                      <td className={`py-3.5 px-4 text-right font-black ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ${pos.unrealizedPnL.toFixed(2)}
                      </td>
                      <td className={`py-3.5 px-4 text-right font-black ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isProfitable ? `+${pos.unrealizedPnLPercentage.toFixed(2)}%` : `${pos.unrealizedPnLPercentage.toFixed(2)}%`}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-4 flex justify-between items-center mt-4">
          <span className="text-xs font-semibold text-slate-400">Total Unrealized P/L</span>
          <span className={`text-xl font-extrabold font-mono ${totalUnrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalUnrealizedPnL >= 0 ? `+$${totalUnrealizedPnL.toFixed(2)}` : `-$${Math.abs(totalUnrealizedPnL).toFixed(2)}`}
          </span>
        </div>
      </div>
    </div>
  );
};