import Logger from '@/lib/logger'
import { CryptoAsset, CurrencyAmount, CurrencyAmountString, Timestamp } from '@/types'

export interface FuturesAssetsServiceOptions {
  logger: Logger
}


export const FuturesAssetsServiceEvents = {
  ASSET_CANDLE_UPDATE: (eventData: CryptoAssetCandle): void => { void (eventData) },
}

export interface FuturesAssetsServiceConfig {
  verbose: boolean,
  logger: (...args: any) => void
  events: typeof FuturesAssetsServiceEvents
  onStart: (options: { assets: CryptoAsset[] }) => Promise<void>
  onStop: () => Promise<void>
}

/**
 * Candlestick type definition from : 
 * https://binance-docs.github.io/apidocs/futures/en/#kline-candlestick-data
 */
export type BinanceAPIAssetCandle = [
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


export interface CryptoAssetCandle {
  asset: CryptoAsset
  open: CurrencyAmount
  close: CurrencyAmount
  high: CurrencyAmount
  low: CurrencyAmount
  volume: Timestamp
  openTime: Timestamp
  closeTime: Timestamp
}
