import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, BarChart3, Briefcase, LineChart, Loader2, Send } from 'lucide-react';
import type { Position, PriceTick, Trade, TradeSide } from '../types/trading';
import { APP_CONSTANTS } from '../constants/appConstants';

interface DashboardPageProps {
  prices: PriceTick[];
  trades: Trade[];
  positions: Position[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  onSubmitOrder: (symbol: string, side: TradeSide, quantity: number) => Promise<boolean>;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  prices,
  trades,
  positions,
  selectedSymbol,
  onSelectSymbol,
  onSubmitOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [side, setSide] = useState<TradeSide>(APP_CONSTANTS.SIDES.BUY as TradeSide);
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredPrices = prices.filter((p) =>
    p.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPriceTick = prices.find((p) => p.symbol === selectedSymbol);
  const executionPrice = currentPriceTick
    ? side === APP_CONSTANTS.SIDES.BUY
      ? currentPriceTick.ask
      : currentPriceTick.bid
    : 0;

  const totalUnrealizedPnL = positions.reduce((sum, p) => sum + p.unrealizedPnL, 0);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSymbol || quantity <= 0) return;

    setIsSubmitting(true);
    setFeedback(null);

    const success = await onSubmitOrder(selectedSymbol, side, quantity);

    setIsSubmitting(false);
    if (success) {
      setFeedback('Order placed successfully!');
    } else {
      setFeedback('Order execution failed.');
    }

    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-[#121829] border border-slate-800/90 rounded-2xl p-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-800/60">
              <h2 className="text-sm font-bold text-white tracking-wide">Live Prices</h2>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search symbol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#0b0f19] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 w-44 font-medium"
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[385px] pr-1">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 font-semibold border-b border-slate-800/80 pb-2 sticky top-0 bg-[#121829] z-10 shadow-sm">
                  <tr>
                    <th className="py-2.5 px-3">Symbol</th>
                    <th className="py-2.5 px-3 text-right">Bid</th>
                    <th className="py-2.5 px-3 text-right">Ask</th>
                    <th className="py-2.5 px-3 text-right">Last Price</th>
                    <th className="py-2.5 px-3 text-right">Change %</th>
                    <th className="py-2.5 px-3 text-right hidden sm:table-cell">High</th>
                    <th className="py-2.5 px-3 text-right hidden sm:table-cell">Low</th>
                    <th className="py-2.5 px-3 text-right hidden md:table-cell">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 font-mono">
                  {filteredPrices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        No symbols found.
                      </td>
                    </tr>
                  ) : (
                    filteredPrices.map((p) => {
                      const isPositive = p.changePercentage >= 0;
                      const isSelected = selectedSymbol === p.symbol;

                      return (
                        <tr
                          key={p.symbol}
                          onClick={() => onSelectSymbol(p.symbol)}
                          className={`cursor-pointer transition-colors h-[50px] ${
                            isSelected
                              ? 'bg-blue-600/15 text-white font-bold'
                              : 'hover:bg-slate-800/40 text-slate-200'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-sans font-bold">{p.symbol}</td>
                          <td className="py-2.5 px-3 text-right text-slate-300 font-medium">
                            {p.bid.toFixed(p.bid < 10 ? 5 : 2)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-300 font-medium">
                            {p.ask.toFixed(p.ask < 10 ? 5 : 2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-extrabold text-white">
                            {p.lastPrice.toFixed(p.lastPrice < 10 ? 5 : 2)}
                          </td>
                          <td className={`py-2.5 px-3 text-right font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPositive ? `+${p.changePercentage.toFixed(2)}%` : `${p.changePercentage.toFixed(2)}%`}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-400 hidden sm:table-cell">
                            {p.high.toFixed(p.high < 10 ? 4 : 2)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-400 hidden sm:table-cell">
                            {p.low.toFixed(p.low < 10 ? 4 : 2)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-500 text-[11px] hidden md:table-cell font-sans">
                            {new Date(p.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#121829] border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between shadow-xl">
              <div>
                <p className="text-xs text-slate-400 font-medium">Total Trades Today</p>
                <h3 className="text-2xl font-bold text-white font-mono mt-1">{trades.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#121829] border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between shadow-xl">
              <div>
                <p className="text-xs text-slate-400 font-medium">Open Positions</p>
                <h3 className="text-2xl font-bold text-white font-mono mt-1">{positions.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#121829] border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between shadow-xl">
              <div>
                <p className="text-xs text-slate-400 font-medium">P/L (Today)</p>
                <h3 className={`text-2xl font-bold font-mono mt-1 ${totalUnrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {totalUnrealizedPnL >= 0 ? `+$${totalUnrealizedPnL.toFixed(2)}` : `-$${Math.abs(totalUnrealizedPnL).toFixed(2)}`}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <LineChart className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1">
          <div className="bg-[#121829] border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white tracking-wide border-b border-slate-800/60 pb-3">Quick Trade</h2>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Symbol</label>
                <select
                  value={selectedSymbol}
                  onChange={(e) => onSelectSymbol(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                >
                  {prices.map((p) => (
                    <option key={p.symbol} value={p.symbol}>
                      {p.symbol}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSide(APP_CONSTANTS.SIDES.BUY as TradeSide)}
                    className={`py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all ${
                      side === APP_CONSTANTS.SIDES.BUY
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-950 ring-2 ring-emerald-400/40'
                        : 'bg-[#1b2339] text-slate-400 hover:text-white'
                    }`}
                  >
                    BUY
                  </button>

                  <button
                    type="button"
                    onClick={() => setSide(APP_CONSTANTS.SIDES.SELL as TradeSide)}
                    className={`py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all ${
                      side === APP_CONSTANTS.SIDES.SELL
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-950 ring-2 ring-rose-400/40'
                        : 'bg-[#1b2339] text-slate-400 hover:text-white'
                    }`}
                  >
                    SELL
                  </button>
                </div>
              </div>

              <div>
                <span className="block text-xs font-medium text-slate-400">Current Price</span>
                <span className="text-xl font-extrabold text-emerald-400 font-mono tracking-tight block mt-0.5">
                  {executionPrice > 0 ? executionPrice.toFixed(executionPrice < 10 ? 5 : 2) : '---'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Quantity</label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Order Type</label>
                <select
                  disabled
                  className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 font-medium cursor-not-allowed"
                >
                  <option>Market</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || executionPrice <= 0}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 disabled:bg-slate-800"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Place Order</span>
                  </>
                )}
              </button>

              {feedback && (
                <p className="text-xs text-center font-semibold text-blue-400 animate-fade-in pt-1">
                  {feedback}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};