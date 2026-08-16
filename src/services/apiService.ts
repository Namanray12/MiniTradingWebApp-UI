import axios from 'axios';
import { APP_CONSTANTS } from '../constants/appConstants';
import type { HealthStatus, OrderPayload, Position, PriceTick, Trade } from '../types/trading';

const apiClient = axios.create({
  baseURL: APP_CONSTANTS.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  getHealth: async (): Promise<HealthStatus> => {
    const response = await apiClient.get<HealthStatus>(APP_CONSTANTS.ENDPOINTS.HEALTH);
    return response.data;
  },

  getPrices: async (): Promise<PriceTick[]> => {
    const response = await apiClient.get<PriceTick[]>(APP_CONSTANTS.ENDPOINTS.PRICES);
    return response.data;
  },

  getTrades: async (): Promise<Trade[]> => {
    const response = await apiClient.get<Trade[]>(APP_CONSTANTS.ENDPOINTS.TRADES);
    return response.data;
  },

  getPositions: async (): Promise<Position[]> => {
    const response = await apiClient.get<Position[]>(APP_CONSTANTS.ENDPOINTS.POSITIONS);
    return response.data;
  },

  placeOrder: async (order: OrderPayload): Promise<Trade> => {
    const response = await apiClient.post<Trade>(APP_CONSTANTS.ENDPOINTS.ORDERS, order);
    return response.data;
  },
};