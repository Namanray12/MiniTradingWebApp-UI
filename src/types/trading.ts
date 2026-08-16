export type TradeSide = 1 | 2;
export type TradeStatus = 1 | 2;

export interface PriceTick {
  symbol: string;
  bid: number;
  ask: number;
  lastPrice: number;
  changePercentage: number;
  high: number;
  low: number;
  timestamp: string;
}

export interface Trade {
  tradeId: string;
  symbol: string;
  side: TradeSide;
  quantity: number;
  price: number;
  timestamp: string;
  status: TradeStatus;
  message?: string;
}

export interface Position {
  symbol: string;
  netQuantity: number;
  averagePrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercentage: number;
}

export interface HealthStatus {
  status: string;
  webSocketStatus: string;
  serverTime: string;
  cachedSymbolsCount: number;
}

export interface OrderPayload {
  symbol: string;
  side: TradeSide;
  quantity: number;
}