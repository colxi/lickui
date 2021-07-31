import Logger from '@/lib/logger'
import FuturesApiService from '@/lib/binance-futures/futures-api'
import { AssetName, BinanceMarginType } from '@/types'
import { AssetCandle } from '../../types'

export interface AssetOptions {
  assetName: AssetName
  candles: AssetCandle[]
  leverage: number
  marginType: BinanceMarginType
  maxCandles: number
  quantityPrecision: number
  logger: Logger
  api: FuturesApiService
}
