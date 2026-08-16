import { useCallback, useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { TradeHistoryPage } from './pages/TradeHistoryPage';
import { PositionsPage } from './pages/PositionsPage';
import { SettingsPage } from './pages/SettingsPage';
import { apiService } from './services/apiService';
import { useSignalR } from './hooks/useSignalR';
import type { HealthStatus, Position, PriceTick, Trade, TradeSide } from './types/trading';

function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [prices, setPrices] = useState<PriceTick[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('EURUSD');

  const fetchInitialData = async () => {
    try {
      const [hData, pData, tData, posData] = await Promise.all([
        apiService.getHealth(),
        apiService.getPrices(),
        apiService.getTrades(),
        apiService.getPositions(),
      ]);
      setHealth(hData);
      setPrices(pData);
      setTrades(tData);
      setPositions(posData);
      if (pData.length > 0) {
        setSelectedSymbol(pData[0].symbol);
      }
    } catch (e) {
    }
  };

  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(async () => {
      try {
        const h = await apiService.getHealth();
        setHealth(h);
      } catch (e) {
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handlePriceUpdate = useCallback((tick: PriceTick) => {
    setPrices((prev) => {
      const idx = prev.findIndex((p) => p.symbol === tick.symbol);
      if (idx === -1) return [tick, ...prev];
      const updated = [...prev];
      updated[idx] = tick;
      return updated;
    });

    setPositions((prev) =>
      prev.map((pos) => {
        if (pos.symbol === tick.symbol) {
          const unrealizedPnL = (tick.lastPrice - pos.averagePrice) * pos.netQuantity;
          const unrealizedPnLPercentage =
            pos.averagePrice > 0
              ? (unrealizedPnL / (pos.averagePrice * Math.abs(pos.netQuantity))) * 100
              : 0;

          return {
            ...pos,
            currentPrice: tick.lastPrice,
            unrealizedPnL: Math.round(unrealizedPnL * 100) / 100,
            unrealizedPnLPercentage: Math.round(unrealizedPnLPercentage * 100) / 100,
          };
        }
        return pos;
      })
    );
  }, []);

  const handleTradeUpdate = useCallback(async (trade: Trade) => {
    setTrades((prev) => [trade, ...prev]);
    try {
      const updatedPositions = await apiService.getPositions();
      setPositions(updatedPositions);
    } catch (e) {
    }
  }, []);

  const { connectionStatus } = useSignalR(handlePriceUpdate, handleTradeUpdate);

  const handleOrderSubmit = async (symbol: string, side: TradeSide, quantity: number) => {
    try {
      const newTrade = await apiService.placeOrder({ symbol, side, quantity });
      if (newTrade && newTrade.status === 1) {
        setTrades((prev) => [newTrade, ...prev]);
        const updatedPositions = await apiService.getPositions();
        setPositions(updatedPositions);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#090d16] text-slate-100 overflow-hidden font-sans">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        wsStatus={health?.webSocketStatus || connectionStatus}
        serverTime={health?.serverTime || ''}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardPage
              prices={prices}
              trades={trades}
              positions={positions}
              selectedSymbol={selectedSymbol}
              onSelectSymbol={setSelectedSymbol}
              onSubmitOrder={handleOrderSubmit}
            />
          )}

          {activeTab === 'history' && <TradeHistoryPage trades={trades} />}

          {activeTab === 'positions' && <PositionsPage positions={positions} />}

          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default App;