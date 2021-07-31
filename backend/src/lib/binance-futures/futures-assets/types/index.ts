import Logger from '@/lib/logger'
import { AssetName, CurrencyAmount, Timestamp } from '../../types'
import FuturesApiService from '../../futures-api'

export interface FuturesAssetsServiceOptions {
  api: FuturesApiService
  logger: Logger
}

export const FuturesAssetsServiceEvents = {
  // none
}

export interface FuturesAssetsServiceConfig {
  verbose: boolean,
  logger: (...args: any) => void
  events: typeof FuturesAssetsServiceEvents
  onStart: (options: { assets: AssetName[] }) => Promise<void>
  onStop: () => Promise<void>
}


export interface AssetCandle {
  assetName: AssetName
  open: CurrencyAmount
  close: CurrencyAmount
  high: CurrencyAmount
  low: CurrencyAmount
  volume: Timestamp
  openTime: Timestamp
  closeTime: Timestamp
}
