import Logger from '@/lib/logger'
import { AssetPriceUpdateEventData } from '../../types'


export type OnAssetPriceUpdateCallback = (eventData: AssetPriceUpdateEventData) => void

export interface FuturesAssetsSocketManagerOptions {
  logger: Logger
  onAssetPriceUpdate: OnAssetPriceUpdateCallback
}

