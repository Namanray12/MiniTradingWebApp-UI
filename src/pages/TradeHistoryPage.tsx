import React, { useState } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Trade } from '../types/trading';

interface TradeHistoryPageProps {
  trades: Trade[];
}

export const TradeHistoryPage: React.FC<TradeHistoryPageProps> = ({ trades }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const totalPages = Math.max(1, Math.ceil(trades.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTrades = trades.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-[#121829] border border-slate-800/90 rounded-2xl p-6 shadow-2xl space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
        <h2 className="text-base font-bold text-white tracking-wide">Trade History</h2>
        <button
          type="button"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0b0f19] border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
        >
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-slate-400 font-semibold border-b border-slate-800/80 pb-2">
            <tr>
              <th className="py-3 px-4">Trade ID</th>
              <th className="py-3 px-4">Symbol</th>
              <th className="py-3 px-4">Side</th>
              <th className="py-3 px-4 text-right">Quantity</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-right">Time</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 font-mono">
            {currentTrades.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No trade executions recorded yet.
                </td>
              </tr>
            ) : (
              currentTrades.map((t) => {
                const isBuy = t.side === 1;

                return (
                  <tr key={t.tradeId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-300">{t.tradeId}</td>
                    <td className="py-3.5 px-4 font-sans font-bold text-white">{t.symbol}</td>
                    <td className={`py-3.5 px-4 font-bold ${isBuy ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isBuy ? 'Buy' : 'Sell'}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-200 font-bold">{t.quantity.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right text-white font-bold">{t.price.toFixed(t.price < 10 ? 5 : 2)}</td>
                    <td className="py-3.5 px-4 text-right text-slate-400 font-sans text-[11px]">
                      {new Date(t.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-500/20">
                        Filled
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-800/60 text-xs text-slate-400">
        <span>
          Showing {trades.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, trades.length)} of {trades.length} trades
        </span>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg bg-[#0b0f19] border border-slate-800 disabled:opacity-40"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setCurrentPage(num)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                currentPage === num
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#0b0f19] border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg bg-[#0b0f19] border border-slate-800 disabled:opacity-40"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};