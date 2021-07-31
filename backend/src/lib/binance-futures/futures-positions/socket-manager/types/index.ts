import { BinanceWebsocketEventType } from '@/lib/binance-futures/types'
import Logger from '@/lib/logger'
import {
  AssetName,
  BinanceMarginType,
  BinancePositionSide,
  CoinName,
  CurrencyAmountString,
  ExecutionType,
  OrderId,
  OrderSide,
  OrderStatus,
  OrderType,
  OrderWorkingType,
  QuantityString,
  TimeInForce,
  Timestamp,
} from '../../../types'

export const ServiceEventsDescriptor = {
  //
}

export type OnPositionUpdateCallback = () => void

export interface FuturesPositionsSocketManagerOptions {
  logger: Logger
  onPositionUpdate: OnPositionUpdateCallback
}

export enum BinanceWebsocketAccountUpdateEventType {
  // BALANCE_FETCH is actually not a Binance Event, bit a lickui internal event
  BALANCE_FETCH = 'BALANCE_FETCH',
  ORDER = 'ORDER',
  ADMIN_DEPOSIT = 'ADMIN_DEPOSIT'
}

export interface BinanceWebsocketAccountUpdateEvent {
  /** Event Time */
  E: number
  /**  Event type */
  e: BinanceWebsocketEventType.ACCOUNT_UPDATE
  /** Transaction time */
  T: number
  /** Update Data */
  a: {
    /** Event reason type */
    m: BinanceWebsocketAccountUpdateEventType
    /** Balances */
    B: {
      /** CoinName */
      a: CoinName
      /** Wallet Balance */
      wb: CurrencyAmountString
      /** Cross Wallet Balance */
      cw: CurrencyAmountString
    }[],
    /** Positions */
    P: {
      /** CoinName */
      s: AssetName
      /** Position Amount */
      pa: CurrencyAmountString,
      /** Entry Price */
      ep: CurrencyAmountString,
      /** (Pre-fee) Accumulated Realized */
      cr: CurrencyAmountString,
      /** Unrealized PnL */
      up: CurrencyAmountString,
      /** Margin Type */
      mt: BinanceMarginType,
      /** Isolated Wallet (if isolated position) */
      iw: CurrencyAmountString,
      /** Position Side */
      ps: BinancePositionSide
    }[]
  }
}


export interface BinanceWebsocketOrderUpdateEvent {
  /** Event Time */
  E: number
  /**  Event type */
  e: BinanceWebsocketEventType.ORDER_TRADE_UPDATE
  /** Transaction time */
  T: number
  o: {
    /**  CoinName */
    s: AssetName,
    /** Client Order Id */
    c: string, // special client order id: starts with "autoclose-": liquidation order "adl_autoclose": ADL auto close order
    /** Side */
    S: OrderSide,
    /** Order Type */
    o: OrderType,
    /** Time in Force */
    f: TimeInForce,
    /** Original Quantity */
    q: QuantityString
    /** Original Price */
    p: CurrencyAmountString
    /** Average Price */
    ap: CurrencyAmountString
    /** Stop Price. Please ignore with TRAILING_STOP_MARKET order */
    sp: CurrencyAmountString
    /** Execution Type */
    x: ExecutionType
    /** Order Status */
    X: OrderStatus,
    /** Order Id */
    i: OrderId,
    /** Order Last Filled Quantity */
    l: "0",
    z: "0",                    // Order Filled Accumulated Quantity
    L: "0",                    // Last Filled Price
    N: "USDT",             // Commission CoinName, will not push if no commission
    n: "0",                // Commission, will not push if no commission
    T: 1568879465651,          // Order Trade Time
    t: 0,                      // Trade Id
    b: "0",                    // Bids Notional
    a: "9.91",                 // Ask Notional
    m: false,                  // Is this trade the maker side?
    R: false,                  // Is this reduce only
    /**Stop Price Working Type */
    wt: OrderWorkingType,
    ot: "TRAILING_STOP_MARKET",    // Original Order Type
    ps: BinancePositionSide,                        // Position Side
    cp: false,                     // If Close-All, pushed with conditional order
    AP: "7476.89",             // Activation Price, only puhed with TRAILING_STOP_MARKET order
    cr: "5.0",                 // Callback Rate, only puhed with TRAILING_STOP_MARKET order
    rp: "0"                            // Realized Profit of the trade
  }
}


export interface FuturesOrderDescriptor {
  time: Timestamp,
  id: OrderId
  assetPair: AssetName
  price: number
  quantity: number
  side: OrderSide
  type: OrderType
  status: OrderStatus
}

export interface FuturesPositionDescriptor {
  time: Timestamp
  assetPair: AssetName
  entryPrice: number
  quantity: number
  unrealizedPnL: number
}
