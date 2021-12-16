import Binance, { CandleChartInterval_LT, Ticker } from 'binance-api-node';
import NewBinance from 'node-binance-api';
import { v4 } from 'uuid';
require('dotenv').config();

const client = Binance({
  // apiKey: process.env.API_KEY,
  // apiSecret: process.env.SECRET_KEY,
});

const binance = new NewBinance().options({
  APIKEY: process.env.API_KEY,
  APISECRET: process.env.SECRET_KEY,
});

import { PrismaClient } from '@prisma/client';
import { BinanceUserProvider } from './providers/BinanceUserProvider';
import { DayJSProvider } from './providers/DayJSProvider';
import { BinanceReadProvider } from './providers/BinanceReadProvider';

const prisma = new PrismaClient();

interface IShort {
  price: string;
  volume: string;
  time: Date;
  actualPercentage: string;
}

interface IShortOpportunity {
  initialPrice: string;
  initialTime: number;
  finalPrice: string;
  averageChange: string;
  highPercentage: string;
  gainTime: string[];
  shorts: IShort[];
  gainPercentage: string[];
  symbol: string;
}

async function main() {
  // const binanceRead = new BinanceReadProvider(client, prisma);
  // const binanceUser = new BinanceUserProvider(client);
  // const dayjs = new DayJSProvider();

  // const startTime = new Date('2021-09-01').getTime();
  // const endTime = new Date('2021-09-02').getTime();

  const symbolsPercentage: Record<string, IShortOpportunity> = {};

  const setPercentage = (initial: number | string, final: number | string) => {
    return ((Number(final) - Number(initial)) / Number(initial)) * 100;
  };

  const saveLocal = (ticker: Ticker) => {
    const price = ticker.curDayClose;

    if (!symbolsPercentage[ticker.symbol]) {
      symbolsPercentage[ticker.symbol] = {
        initialPrice: ticker.curDayClose,
        initialTime: ticker.eventTime,
        finalPrice: ticker.curDayClose,
        highPercentage: '0',
        gainTime: [],
        gainPercentage: [],
        shorts: [],
        symbol: ticker.symbol,
        averageChange: '0',
      };
    }

    const goodLengthShort = symbolsPercentage[ticker.symbol].shorts.length > 20;
    const lastShort =
      symbolsPercentage[ticker.symbol].shorts[
        symbolsPercentage[ticker.symbol].shorts.length - 1
      ];

    const actualPriceWeight = 2;
    const actualPercentageChange = lastShort
      ? Math.abs(setPercentage(lastShort.price, price))
      : 0;

    symbolsPercentage[ticker.symbol].averageChange = String(
      (Number(symbolsPercentage[ticker.symbol].averageChange) *
        symbolsPercentage[ticker.symbol].shorts.length +
        actualPercentageChange * actualPriceWeight) /
        (actualPriceWeight + symbolsPercentage[ticker.symbol].shorts.length),
    );

    const getStartPrice = () => {
      if (!lastShort) {
        return price;
      }

      return symbolsPercentage[ticker.symbol].initialPrice;
    };

    const getHighPercentage = (actualPercentage: number) => {
      if (!lastShort || actualPercentage < 0) {
        return 0;
      }

      const lastGain =
        symbolsPercentage[ticker.symbol].gainPercentage[
          symbolsPercentage[ticker.symbol].gainPercentage.length - 1
        ] || false;

      const lastGainTime =
        symbolsPercentage[ticker.symbol].gainTime[
          symbolsPercentage[ticker.symbol].gainTime.length - 1
        ] || false;

      if (
        lastGainTime &&
        (ticker.eventTime - symbolsPercentage[ticker.symbol].initialTime) /
          1000 -
          Number(lastGainTime) >
          20
      ) {
        if (lastGain) {
          symbolsPercentage[ticker.symbol].gainPercentage.push(
            String(actualPercentage),
            'timeout',
          );
          symbolsPercentage[ticker.symbol].gainTime.push(
            String(
              (ticker.eventTime -
                symbolsPercentage[ticker.symbol].initialTime) /
                1000,
            ),
            'timeout',
          );
        }
        return false;
      }

      if (actualPercentage < 0 && !lastGain) return false;

      const lastGainCompareActual = lastGain
        ? actualPercentage - Number(lastGain)
        : 0;

      const actualPercentageCompareHighPrice =
        actualPercentage -
        Number(symbolsPercentage[ticker.symbol].highPercentage);

      // reseta se perda comparado ao highPercentage for maior que 0,2%
      //     (actualPercentage <= 0.3 &&
      // Number(symbolsPercentage[ticker.symbol].highPercentage) > 0.5) ||
      // actualPercentage > 2

      if (
        actualPercentageCompareHighPrice <= -0.5 ||
        (lastGain && lastGainCompareActual <= -0.5)
      ) {
        if (lastGain) {
          symbolsPercentage[ticker.symbol].gainPercentage.push(
            String(actualPercentage),
            'low',
          );
          symbolsPercentage[ticker.symbol].gainTime.push(
            String(
              (ticker.eventTime -
                symbolsPercentage[ticker.symbol].initialTime) /
                1000,
            ),
            'low',
          );
        }
        return false;
      }

      // grava das se percentual de ganho for maior que 0,1
      if (
        Math.abs(lastGainCompareActual) >= 0.1 ||
        (lastGain === false && actualPercentage >= 0.1)
      ) {
        symbolsPercentage[ticker.symbol].gainPercentage.push(
          String(actualPercentage),
        );
        symbolsPercentage[ticker.symbol].gainTime.push(
          String(
            (ticker.eventTime - symbolsPercentage[ticker.symbol].initialTime) /
              1000,
          ),
        );

        if (symbolsPercentage[ticker.symbol].gainPercentage.length > 30) {
          symbolsPercentage[ticker.symbol].gainPercentage.shift();
        }
        if (symbolsPercentage[ticker.symbol].gainTime.length > 30) {
          symbolsPercentage[ticker.symbol].gainTime.shift();
        }
      }

      // seta novo valor de highPercentage se o actualPercentage for maior
      if (
        actualPercentage >
        Number(symbolsPercentage[ticker.symbol].highPercentage)
      )
        return actualPercentage;

      return Number(symbolsPercentage[ticker.symbol].highPercentage);
    };

    const startPrice = getStartPrice();
    const actualPercentage = String(setPercentage(startPrice, price));
    const highPercentage = goodLengthShort
      ? getHighPercentage(Number(actualPercentage))
      : false;

    if (highPercentage === false) {
      symbolsPercentage[ticker.symbol].finalPrice = price;
      if (Number(symbolsPercentage[ticker.symbol].highPercentage) > 0.8) {
        console.log(`save: `, ticker.symbol);
        const { shorts, ...prints } = symbolsPercentage[ticker.symbol];
        console.log(`object`, prints);
        console.log('...');
        console.log('...');
        console.log('...');
        console.log('...');
      }
      symbolsPercentage[ticker.symbol].gainPercentage = [];
      symbolsPercentage[ticker.symbol].gainTime = [];
      symbolsPercentage[ticker.symbol].initialTime = ticker.eventTime;
    }

    symbolsPercentage[ticker.symbol].initialPrice =
      highPercentage === false ? price : startPrice;

    symbolsPercentage[ticker.symbol].highPercentage =
      typeof highPercentage === 'boolean' ? '0' : String(highPercentage);

    symbolsPercentage[ticker.symbol].shorts.push({
      price,
      time: new Date(ticker.eventTime),
      volume: ticker.volume,
      actualPercentage,
    });

    if (symbolsPercentage[ticker.symbol].shorts.length > 120) {
      symbolsPercentage[ticker.symbol].shorts.shift();
    }
  };

  const saveDatabase = ({
    shorts,
    initialTime,
    ...shortOpportunity
  }: IShortOpportunity) => {
    console.log(`save: `, shortOpportunity.symbol);

    prisma.shortOpportunity.create({
      data: {
        ...shortOpportunity,
        shorts: { createMany: { data: shorts } },
      },
    });
  };

  let timeout = 0;

  client.ws.allTickers(tickers => {
    if (timeout < 0) return (timeout += 1);
    timeout = 0;

    console.time();

    tickers.forEach(ticker => {
      if (!ticker.symbol.includes('USDT')) return;
      saveLocal(ticker);
    });

    console.timeEnd();
  });

  // binanceRead.saveCandlesByPeriod({ startTime, endTime });
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
