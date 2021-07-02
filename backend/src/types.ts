
export type PlainObject = Record<PropertyKey, unknown>

export interface FuturesOrderDescriptor {
  time: Timestamp,
  id: OrderId
  assetPair: AssetPair
  price: number
  quantity: number
  side: OrderSide
  type: OrderType
  status: OrderStatus
}

export interface FuturesPositionDescriptor {
  time: Timestamp
  assetPair: AssetPair
  entryPrice: number
  quantity: number
  unrealizedPnL: number
}


export type BinanceClientOrderMap = Record<OrderIdString, FuturesOrderDescriptor>

export type BinanceClientPositionMap = Record<AssetPair, FuturesPositionDescriptor>

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

export type Asset = string
export type AssetPair = string
export type CurrencyAmountString = string
export type CurrencyAmount = number
export type Leverage = string
export type OrderId = number
export type OrderIdString = string
export type Timestamp = number
export type QuantityString = string

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

export interface BinanceAPIAssetPrice {
  symbol: AssetPair
  price: CurrencyAmountString
  time: Timestamp
}

export interface BinanceFuturesAPIOrder {
  avgPrice: CurrencyAmountString,
  clientOrderId: string,
  cumQuote: string,
  executedQty: number,
  orderId: OrderId,
  origQty: CurrencyAmountString,
  origType: OrderType,
  price: CurrencyAmountString,
  reduceOnly: boolean,
  side: OrderSide,
  positionSide: BinancePositionSide,
  status: OrderStatus,
  stopPrice: CurrencyAmountString, // please ignore when order type is TRAILING_STOP_MARKET
  closePosition: false, // if Close-All
  symbol: AssetPair,
  time: number, // order time
  timeInForce: TimeInForce,
  type: OrderType,
  activatePrice: CurrencyAmountString, // activation price, only return with TRAILING_STOP_MARKET order
  priceRate: string, // callback rate, only return with TRAILING_STOP_MARKET order (eg. 0.3)
  updateTime: number, // update time
  workingType: OrderWorkingType,
  priceProtect: boolean // if conditional order trigger is protected   
}

export interface BinanceFuturesAPIPosition {
  symbol: AssetPair
  initialMargin: CurrencyAmountString
  maintMargin: CurrencyAmountString
  unrealizedProfit: CurrencyAmountString
  positionInitialMargin: CurrencyAmountString
  openOrderInitialMargin: CurrencyAmountString
  leverage: Leverage
  isolated: boolean
  entryPrice: CurrencyAmountString
  maxNotional: CurrencyAmountString
  positionSide: BinancePositionSide
  positionAmt: CurrencyAmountString
  notional: CurrencyAmountString
  isolatedWallet: CurrencyAmountString
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
  ASSET_PRICE_UPDATE = 'markPriceUpdate'
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
  /** Asset */
  a: Asset
  /** Wallet Balance */
  wb: CurrencyAmountString
  /** Cross Wallet Balance */
  cw: CurrencyAmountString
}

export interface AccountUpdateEventPositionData {
  /** Symbol */
  s: AssetPair
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

export interface AccountUpdateEvent extends BinanceSocketEvent {
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


/******************************************************************************
 *
 * ORDER UPDATE EVENT
 *
 ******************************************************************************/

export interface OrderUpdateEventOrderData {
  /**  Symbol */
  s: AssetPair,
  /** Client Order Id */
  c: string, // special client order id: starts with "autoclose-": liquidation order "adl_autoclose": ADL auto close order
  /** Side */
  S: OrderSide,
  /** Order Type */
  o: OrderType,
  /** Time in Force */
  f: TimeInForce,
  /** Original Quantity */
  q: "0.001",
  /** Original Price */
  p: "0",
  /** Average Price */
  ap: "0",
  /** Stop Price. Please ignore with TRAILING_STOP_MARKET order */
  sp: "7103.04",
  /** Execution Type */
  x: "NEW",
  /** Order Status */
  X: OrderStatus,
  /** Order Id */
  i: OrderId,
  /** Order Last Filled Quantity */
  l: "0",
  z: "0",                    // Order Filled Accumulated Quantity
  L: "0",                    // Last Filled Price
  N: "USDT",             // Commission Asset, will not push if no commission
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

export interface OrderUpdateEvent extends BinanceSocketEvent {
  /**  Event type */
  e: BinanceWebsocketEventType.ORDER_TRADE_UPDATE
  /** Transaction time */
  T: number
  o: OrderUpdateEventOrderData
}


/******************************************************************************
 *
 * Balance
 *
 ******************************************************************************/


export interface BinanceBalanceData {
  totalBalance: number,
  availableBalance: number
}


/******************************************************************************
 *
 * Liquidations
 *
 ******************************************************************************/

export interface LiquidationsEventLiquidationsData {
  /** Symbol */
  s: AssetPair
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

export interface LiquidationsEvent extends BinanceSocketEvent {
  /**  Event type */
  e: BinanceWebsocketEventType.LIQUIDATIONS_UPDATE
  /** Transaction time */
  T: number
  o: LiquidationsEventLiquidationsData
}


/******************************************************************************
 *
 * Market Price
 *
 ******************************************************************************/


export interface AssetPriceUpdateEvent extends BinanceSocketEvent {
  // Event type
  e: BinanceWebsocketEventType.ASSET_PRICE_UPDATE
  // Event time
  E: Timestamp
  // Symbol
  s: AssetPair
  // Mark price
  p: CurrencyAmountString
  // Index price
  i: CurrencyAmountString
  // Estimated Settle Price, only useful in the last hour before the settlement starts
  P: CurrencyAmountString
  // Funding rate
  r: string // '0.0024324325'
  // Next funding time
  T: Timestamp
}