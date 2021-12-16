import { Binance, CandlesOptions } from 'binance-api-node';
import { DayJSProvider } from './DayJSProvider';

class BinanceUserProvider {
  constructor(private binance: Binance) {}

  async getMyTrades(par: string = 'BTCBUSD') {
    const myTrades = await this.binance.myTrades({ symbol: par });

    const myTradesFormat = myTrades.map(trades => ({
      ...trades,
      time: new Date(trades.time),
    }));

    return myTradesFormat;
  }
}

export { BinanceUserProvider };
