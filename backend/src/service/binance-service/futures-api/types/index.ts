import { AssetName, CandlestickInterval, CurrencyAmountString, Timestamp } from '@/types'

// API SERVICE TYPES 


export interface GetAssetPairCandlesOptions {
  asset: AssetName
  interval: CandlestickInterval
  startTime: Timestamp
  endTime?: Timestamp
  limit?: number
}


// BINANCE API TYPES

/**
 * 
 * 
 */
export interface BinanceFuturesApiServerTime {
  serverTime: number
}

/**
 * 
 * 
 */
export interface BinanceFuturesApiUserDataKey {
  listenKey: string
}

/**
 * 
 * 
 */
export interface BinanceFuturesApiBalanceData {
  totalBalance: number,
  availableBalance: number
}

/**
 * Futures Exchange information
 * https://binance-docs.github.io/apidocs/futures/en/#exchange-information
 */
export interface BinanceFuturesApiExchangeInfo {
  timezone: any
  futuresType: any
  rateLimits: {
    rateLimitType: 'REQUEST_WEIGHT' | 'ORDERS' | 'RAW_REQUESTS',
    interval: 'MINUTE' | 'SECOND' | 'DAY',
    intervalNum: number,
    limit: number
  }[]
  exchangeFilters: any
  assets: any
  symbols: any
  // serverTime: Timestamp // This value is deprecated, ignore it
}

/**
 * Candlestick type definition from : 
 * https://binance-docs.github.io/apidocs/futures/en/#kline-candlestick-data
 */
export type BinanceFuturesApiAssetCandle = [
  /** Open time */
  Timestamp,
  /** Open */
  CurrencyAmountString,
  /** High */
  CurrencyAmountString,
  /** Low */
  CurrencyAmountString,
  /** Close */
  CurrencyAmountString,
  /** Volume */
  CurrencyAmountString,
  /** Close time */
  Timestamp,
  /** Quote asset volume */
  CurrencyAmountString,
  /** Number of trades */
  number,
  /** Taker buy base asset volume */
  CurrencyAmountString,
  /** Taker buy quote asset volume */
  CurrencyAmountString,
  /** Ignore. */
  CurrencyAmountString
]
