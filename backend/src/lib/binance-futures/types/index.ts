import { ServiceStatus } from '@/lib/evented-service/types'

export interface BinanceServiceStartOptions {
  assetPairs: AssetName[]
}

export interface BinanceServiceStatus {
  isActive: boolean
  isBusy: boolean
  services: {
    wallet: {
      status: ServiceStatus
      isSocketConnected: boolean
    },
    liquidations: {
      status: ServiceStatus
      isSocketConnected: boolean
    },
    assets: {
      status: ServiceStatus
      isSocketConnected: boolean
    }
  }
}


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


export enum BinanceWebsocketEventType {
  ACCOUNT_UPDATE = 'ACCOUNT_UPDATE',
  ORDER_TRADE_UPDATE = 'ORDER_TRADE_UPDATE',
  LIQUIDATIONS_UPDATE = 'forceOrder',
  ASSET_CANDLE_UPDATE = 'kline'
}

export type Timestamp = number
export type CoinName = string
export type AssetName = string
export type CurrencyAmountString = string
export type CurrencyAmount = number
export type OrderId = number
export type ClientOrderId = string
export type OrderIdString = string
export type QuantityString = string


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

export interface BinanceFuturesWallet {
  totalBalance: number
  availableBalance: number
}
