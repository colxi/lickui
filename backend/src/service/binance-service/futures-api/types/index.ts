import { AssetName, BinancePositionSide, CandlestickInterval, ClientOrderId, CoinName, CurrencyAmount, CurrencyAmountString, Leverage, OrderId, OrderSide, OrderStatus, OrderType, OrderWorkingType, QuantityString, TimeInForce, Timestamp } from '@/types'

// API SERVICE TYPES 


export interface GetAssetPairCandlesOptions {
  asset: AssetName
  interval: CandlestickInterval
  startTime: Timestamp
  endTime?: Timestamp
  limit?: number
}


export interface CreateFuturesMarketOrderOptions {
  assetName: AssetName
  side: OrderSide
  quantity: CurrencyAmount
}

export interface GetFuturesOrderByClientIdOptions {
  assetName: AssetName
  clientOrderId: ClientOrderId
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
  timezone: 'UTC'
  exchangeFilters: unknown[]
  rateLimits: {
    rateLimitType: 'REQUEST_WEIGHT' | 'ORDERS' | 'RAW_REQUESTS'
    interval: 'MINUTE' | 'SECOND' | 'DAY'
    intervalNum: number,
    limit: number
  }[]
  assets: {
    asset: CoinName
    marginAvailable: boolean // whether the asset can be used as margin in Multi-Assets mode
    autoAssetExchange: number // auto-exchange threshold in Multi-Assets margin mode
  }[],
  symbols: {
    symbol: AssetName
    pair: AssetName
    contractType: 'PERPETUAL'
    deliveryDate: Timestamp
    onboardDate: Timestamp
    status: 'TRADING'
    baseAsset: CoinName
    quoteAsset: CoinName
    marginAsset: CoinName
    pricePrecision: number    // please do not use it as tickSize
    quantityPrecision: number // please do not use it as stepSize
    baseAssetPrecision: number
    quotePrecision: number
    underlyingType: 'COIN',
    underlyingSubType: ['STORAGE'],
    settlePlan: number
    triggerProtect: QuantityString, // threshold for algo order with 'priceProtect'
    filters: unknown[]
    OrderType: OrderType[]
    timeInForce: TimeInForce[]
    liquidationFee: QuantityString  // liquidation fee rate
    marketTakeBound: QuantityString // the max price difference rate( from mark price) a market order can make
  }[]
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


/**
 * 
 * 
 */
export interface BinanceFuturesAPIPosition {
  symbol: AssetName
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


/**
 * 
 * 
 */

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
  symbol: AssetName,
  time: number, // order time
  timeInForce: TimeInForce,
  type: OrderType,
  activatePrice: CurrencyAmountString, // activation price, only return with TRAILING_STOP_MARKET order
  priceRate: string, // callback rate, only return with TRAILING_STOP_MARKET order (eg. 0.3)
  updateTime: number, // update time
  workingType: OrderWorkingType,
  priceProtect: boolean // if conditional order trigger is protected   
}

