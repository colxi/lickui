import Logger from '@/lib/logger'
import { AssetName, CurrencyAmount, OrderSide, Timestamp } from '@/types'

export interface FuturesLiquidationsServiceOptions {
  logger: Logger
}

export const FuturesLiquidationsServiceEvents = {
  LIQUIDATION_EVENT: (eventData: LiquidationEvent): void => { void (eventData) },
}

export interface FuturesLiquidationsServiceConfig {
  verbose: boolean,
  logger: (...args: any) => void
  events: typeof FuturesLiquidationsServiceEvents
  onStart: (options: { assets: AssetName[] }) => Promise<void>
  onStop: () => Promise<void>
}

export interface LiquidationEvent {
  timestamp: Timestamp
  assetName: AssetName
  total: CurrencyAmount
  price: CurrencyAmount
  side: OrderSide
  quantity: number
}
