import Logger from '@/lib/logger'
import { BinanceSocketEvent, BinanceWebsocketEventType, CandlestickInterval, CryptoAsset, CurrencyAmountString, OrderId, QuantityString, Timestamp } from '@/types'
import { CryptoAssetCandle } from '../../types'


export type OnAssetCandleUpdateCallback = (eventData: CryptoAssetCandle) => void

export interface FuturesAssetsSocketManagerOptions {
  logger: Logger
  onAssetCandleUpdate: OnAssetCandleUpdateCallback
}
export interface FuturesAssetsSocketManagerConnectOptions {
  assets: CryptoAsset[]
}

export interface BinanceWebsocketAssetCandleUpdateEvent {
  /** Event type */
  e: BinanceWebsocketEventType.ASSET_CANDLE_UPDATE
  /** Event time */
  E: Timestamp
  /** Symbol (asset pair) */
  s: CryptoAsset
  k: {
    /** Kline start time */
    t: Timestamp
    /** Kline close time */
    T: Timestamp
    /** Symbol (asset pair) */
    s: CryptoAsset
    /** Interval */
    i: CandlestickInterval
    /** First trade ID */
    f: OrderId
    /** Last trade ID */
    L: OrderId
    /** Open price */
    o: CurrencyAmountString
    /** Close price */
    c: CurrencyAmountString
    /** High price */
    h: CurrencyAmountString
    /** Low price */
    l: CurrencyAmountString
    /** Base asset volume */
    v: QuantityString
    /** Number of trades */
    n: number
    /** Is this kline closed? */
    x: boolean
    /** Quote asset volume */
    q: QuantityString
    /** Taker buy base asset volume */
    V: QuantityString
    /** Taker buy quote asset volume */
    Q: QuantityString
    /** Ignore */
    B: QuantityString
  }
}
