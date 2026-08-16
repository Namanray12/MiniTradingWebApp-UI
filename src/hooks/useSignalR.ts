import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { APP_CONSTANTS } from '../constants/appConstants';
import type { PriceTick, Trade } from '../types/trading';

export function useSignalR(
  onPriceUpdate: (tick: PriceTick) => void,
  onTradeUpdate: (trade: Trade) => void
) {
  const [connectionStatus, setConnectionStatus] = useState<string>(APP_CONSTANTS.STATUS.CONNECTING);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(APP_CONSTANTS.SIGNALR_HUB_URL, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.None)
      .build();

    connection.on(APP_CONSTANTS.SIGNALR_EVENTS.RECEIVE_PRICE, (tick: PriceTick) => {
      onPriceUpdate(tick);
    });

    connection.on(APP_CONSTANTS.SIGNALR_EVENTS.RECEIVE_TRADE, (trade: Trade) => {
      onTradeUpdate(trade);
    });

    connection
      .start()
      .then(() => setConnectionStatus(APP_CONSTANTS.STATUS.CONNECTED))
      .catch(() => setConnectionStatus(APP_CONSTANTS.STATUS.ERROR));

    connection.onreconnecting(() => setConnectionStatus(APP_CONSTANTS.STATUS.CONNECTING));
    connection.onreconnected(() => setConnectionStatus(APP_CONSTANTS.STATUS.CONNECTED));
    connection.onclose(() => setConnectionStatus(APP_CONSTANTS.STATUS.DISCONNECTED));

    return () => {
      connection.stop();
    };
  }, [onPriceUpdate, onTradeUpdate]);

  return { connectionStatus };
}