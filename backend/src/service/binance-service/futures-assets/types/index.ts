import Logger from '@/lib/logger'
import { CryptoAsset, CurrencyAmount, Timestamp } from '@/types'

export interface FuturesAssetsServiceOptions {
  logger: Logger
}

export interface AssetPriceUpdateEventData {
  timestamp: Timestamp
  asset: CryptoAsset
  price: CurrencyAmount
}

export const FuturesAssetsServiceEvents = {
  ASSET_PRICE_UPDATE: (eventData: AssetPriceUpdateEventData): void => { void (eventData) },
}


export interface FuturesAssetsServiceConfig {
  verbose: boolean,
  logger: (...args: any) => void
  events: typeof FuturesAssetsServiceEvents
  onStart: (options: { assets: CryptoAsset[] }) => Promise<void>
  onStop: () => Promise<void>
}