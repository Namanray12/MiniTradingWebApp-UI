export const APP_CONSTANTS = {
  API_BASE_URL: 'https://localhost:7078',
  SIGNALR_HUB_URL: 'https://localhost:7078/hubs/trading',
  ENDPOINTS: {
    HEALTH: '/api/health',
    PRICES: '/api/prices',
    ORDERS: '/api/orders',
    TRADES: '/api/trades',
    POSITIONS: '/api/positions',
    AUTH_TOKEN: '/api/auth/token',
  },
  SIGNALR_EVENTS: {
    RECEIVE_PRICE: 'ReceivePriceUpdate',
    RECEIVE_TRADE: 'ReceiveTradeUpdate',
  },
  STATUS: {
    CONNECTED: 'CONNECTED',
    CONNECTING: 'CONNECTING',
    DISCONNECTED: 'DISCONNECTED',
    ERROR: 'ERROR',
    FILLED: 'Filled',
    REJECTED: 'Rejected',
  },
  SIDES: {
    BUY: 1,
    SELL: 2,
  },
};