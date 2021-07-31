import Logger from '@/lib/logger'
import { LiquidationEvent } from '../../types'
import {
  AssetName,
  BinanceWebsocketEventType,
  CurrencyAmount,
  CurrencyAmountString,
  OrderSide,
  OrderStatus,
  OrderType,
  QuantityString,
  TimeInForce,
  Timestamp
} from '@/types'

interface LiquidationsUpdateEventData {
  assetPair: AssetName
  price: CurrencyAmount
  total: CurrencyAmount
  quantity: number
  side: OrderSide
}

export const ServiceName = 'LiquidationsSocketService'

export const ServiceEventsDescriptor = {
  LIQUIDATIONS_UPDATE: (eventData: LiquidationsUpdateEventData): void => { void (eventData) }
}


export type OntLiquidationUpdateCallback = (eventData: LiquidationEvent) => void

export interface FuturesLiquidationsSocketManagerOptions {
  logger: Logger
  onLiquidationUpdate: OntLiquidationUpdateCallback
}

export interface FuturesLiquidationsSocketManagerConnectOptions {
  assets: AssetName[]
}

export interface BinanceWebsocketLiquidationEvent {
  /** Event type */
  e: BinanceWebsocketEventType.LIQUIDATIONS_UPDATE
  /** Event Time */
  E: number
  /** Transaction time */
  T: number
  o: {
    /** CoinName */
    s: AssetName
    /** Side */
    S: OrderSide
    /** Order Type */
    o: OrderType.LIMIT
    // Time in Force
    f: TimeInForce
    // Original Quantity
    q: QuantityString
    // Price
    p: CurrencyAmountString
    // Average Price
    ap: CurrencyAmountString
    // Order Status
    X: OrderStatus.FILLED
    // Order Last Filled Quantity
    l: QuantityString
    // Order Filled Accumulated Quantity
    z: QuantityString
    // Order Trade Time
    T: Timestamp
  }
}
