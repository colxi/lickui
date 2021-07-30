
export type PlainObject = Record<PropertyKey, unknown>


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


export type BinanceClientOrderMap = Record<OrderIdString, FuturesOrderDescriptor>

export type BinanceClientPositionMap = Record<AssetName, FuturesPositionDescriptor>

////////////////////

// export type Immutable<T extends Record<string, unknown>> = {
//   readonly [K in keyof T]: T[K] extends Record<string, unknown>
//   ? Immutable<T[K]>
//   : T[K]
// }

export type Immutable<T> =
  T extends (infer R)[] ? DeepReadonlyArray<R> :
  T extends Function ? T :
  T extends object ? DeepReadonlyObject<T> :
  T;

interface DeepReadonlyArray<T> extends ReadonlyArray<Immutable<T>> {
  ___?: any
}

type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: Immutable<T[P]>;
};

///

export type CoinName = string
export type AssetName = string
export type CurrencyAmountString = string
export type CurrencyAmount = number
export type Leverage = string
export type OrderId = number
export type ClientOrderId = string
export type OrderIdString = string
export type Timestamp = number
export type QuantityString = string

/** 
 * Kline/Candlestick chart intervals
 */
export enum CandlestickInterval {
  MINUTE_1 = '1m',
  MINUTE_3 = '3m',
  MINUTE_5 = '5m',
  MINUTE_15 = '15m',
  MINUTE_30 = '30m',
  HOUR_1 = '1h',
  HOUR_2 = '2h',
  HOUR_$ = '4h',
  HOUR_6 = '6h',
  HOUR_8 = '8h',
  HOUR_12 = '12h',
  DAY_1 = '1d',
  DAY_3 = '3d',
  WEEK_1 = '1w',
  MONTH_1 = '1M'
}

export enum ContractStatus {
  PENDING_TRADING = 'PENDING_TRADING',
  TRADING = 'TRADING',
  PRE_DELIVERING = 'PRE_DELIVERING',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  PRE_SETTLE = 'PRE_SETTLE',
  SETTLING = 'SETTLING',
  CLOSE = 'CLOSE'
}

export enum ExecutionType {
  NEW = 'NEW',
  CANCELED = 'CANCELED',
  CALCULATED = 'CALCULATED',// - Liquidation Execution
  EXPIRED = 'EXPIRED',
  TRADE = 'TRADE'
}

export enum OrderStatus {
  NEW = 'NEW',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  FILLED = 'FILLED',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export enum OrderType {
  LIMIT = 'LIMIT',
  MARKET = 'MARKET',
  STOP = 'STOP',
  STOP_MARKET = 'STOP_MARKET',
  TAKE_PROFIT = 'TAKE_PROFIT',
  TAKE_PROFIT_MARKET = 'TAKE_PROFIT_MARKET',
  TRAILING_STOP_MARKET = 'TRAILING_STOP_MARKET'
}

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum OrderWorkingType {
  MARK_PRICE = 'MARK_PRICE',
  CONTRACT_PRICE = 'CONTRACT_PRICE',
}

export enum TimeInForce {
  GTC = 'GTC', // Good Till Cancel
  IOC = 'IOC', // Immediate or Cancel
  FOK = 'FOK', // Fill or Kill
  GTX = 'GTX' // Good Till Crossing(Post Only)
}


export enum BinancePositionSide {
  BOTH = 'BOTH',
  LONG = 'LONG',
  SHORT = 'SHORT'
}

export enum BinanceMarginType {
  ISOLATED = 'isolated',
  CROSS = 'cross'
}

export enum BinanceClientMode {
  PRODUCTION = 'PRODUCTION',
  TEST = 'TEST'
}

export interface BinanceFuturesWallet {
  totalBalance: number
  availableBalance: number
}


export enum BinanceWebsocketEventType {
  ACCOUNT_UPDATE = 'ACCOUNT_UPDATE',
  ORDER_TRADE_UPDATE = 'ORDER_TRADE_UPDATE',
  LIQUIDATIONS_UPDATE = 'forceOrder',
  ASSET_CANDLE_UPDATE = 'kline'
}


export interface BinanceSocketEvent {
  /**  Event Type */
  e: BinanceWebsocketEventType
  /** Event Time */
  E: number
}


/******************************************************************************
 * 
 * ACCOUNT UPDATE EVENT (Wallet + Positions)
 * 
 ******************************************************************************/


/**
 * ACCOUNT_UPDATE will be pushed only when update happens on user's account, 
 * including changes on balances, positions, or margin type.
 * Unfilled orders or cancelled orders will not make the event ACCOUNT_UPDATE 
 * pushed, since there's no change on positions.
 * Only positions of symbols with non-zero isolated wallet or non-zero position 
 * amount will be pushed in the "position" part of the event ACCOUNT_UPDATE 
 * when any position changes.
 * https://binance-docs.github.io/apidocs/futures/en/#event-balance-and-position-update
 */

export interface AccountUpdateEventWalletData {
  /** CoinName */
  a: CoinName
  /** Wallet Balance */
  wb: CurrencyAmountString
  /** Cross Wallet Balance */
  cw: CurrencyAmountString
}

export interface AccountUpdateEventPositionData {
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
}

export enum AccountUpdateEventType {
  // BALANCE_FETCH is actually not a Binance Event, bit a lickui internal event
  BALANCE_FETCH = 'BALANCE_FETCH',
  ORDER = 'ORDER',
  ADMIN_DEPOSIT = 'ADMIN_DEPOSIT'
}

export interface AccountUpdateEvent {
  /** Event Time */
  E: number
  /**  Event type */
  e: BinanceWebsocketEventType.ACCOUNT_UPDATE
  /** Transaction time */
  T: number
  /** Update Data */
  a: {
    /** Event reason type */
    m: AccountUpdateEventType
    /** Balances */
    B: Array<AccountUpdateEventWalletData>,
    /** Positions */
    P: Array<AccountUpdateEventPositionData>
  }
}
