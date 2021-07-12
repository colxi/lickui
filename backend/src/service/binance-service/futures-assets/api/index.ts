import { binanceFetch } from '../../api'
import { CandlestickInterval, AssetName, Timestamp } from '@/types'
import { BinanceAPIAssetCandle } from '../types'

interface GetAssetPairCandlesOptions {
  asset: AssetName
  interval: CandlestickInterval
  startTime: Timestamp
  endTime?: Timestamp
  limit?: number
}

export async function getAssetCandles({
  asset,
  interval,
  startTime,
  endTime = Date.now(),
  limit = 99
}: GetAssetPairCandlesOptions): Promise<BinanceAPIAssetCandle[]> {
  const data: any = await binanceFetch(
    `https://fapi.binance.com/fapi/v1/klines?symbol=${asset}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=${limit}`,
    'GET',
    false
  )
  return data
}
