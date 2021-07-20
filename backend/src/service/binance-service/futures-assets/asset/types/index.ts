import Logger from '@/lib/logger'
import { AssetName } from '@/types'
import { AssetCandle } from '../../types'

export interface AssetOptions {
  assetName: AssetName
  candles: AssetCandle[]
  maxCandles: number
  logger: Logger
}
