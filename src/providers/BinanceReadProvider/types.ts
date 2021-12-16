import { CandleChartInterval_LT } from 'binance-api-node';

export interface ISaveCandlesDatabase {
  symbol?: string;
  limit?: number;
  startTime: number;
  endTime?: number;
  interval?: CandleChartInterval_LT;
}
