import { PrismaClient } from '@prisma/client';
import { Binance, CandlesOptions } from 'binance-api-node';
import { later } from '../../shared/helpers/later';
import { ISaveCandlesDatabase } from './types';

class BinanceReadProvider {
  constructor(private binance: Binance, private prisma: PrismaClient) {}

  async getPrice(par: string = 'BTCBUSD') {
    const price = await this.binance.prices({ symbol: par });
    return price;
  }

  async getCandles(options?: Partial<CandlesOptions>) {
    const candles = await this.binance.candles({
      symbol: 'BTCBUSD',
      interval: '1m',
      limit: 5,
      ...options,
    });

    const candlesFormat = candles.map(candle => ({
      ...candle,
      openTime: new Date(candle.openTime),
      closeTime: new Date(candle.closeTime),
    }));

    return candlesFormat;
  }

  async saveCandlesByPeriod({
    startTime,
    endTime,
    symbol = 'BTCBUSD',
    interval = '1m',
    limit = 500,
  }: ISaveCandlesDatabase) {
    const candles = await this.getCandles({
      limit,
      interval,
      symbol,
      startTime,
    });

    if (endTime) {
      const lastCandle = candles[candles.length - 1];
      this.prisma.coin.create({
        data: { symbol, candles: { createMany: { data: candles } } },
      });

      if (lastCandle.closeTime.getTime() < endTime) {
        await later(1000);

        console.log(`next`);
        this.saveCandlesByPeriod({
          endTime,
          startTime: lastCandle.closeTime.getTime(),
          interval,
        });
      }
    }
  }

  async getAllTickersByCoin(coin: string = 'BUSD') {
    const allTickers = await this.binance.allBookTickers();
    return Object.keys(allTickers)
      .map(key => key)
      .filter(key => key.includes(coin));
  }
}

export { BinanceReadProvider };
