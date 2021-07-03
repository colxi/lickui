import { BinanceAPIAssetPrice } from '@/types'
import { binanceFetch } from '../../api'

export async function getAssetsPrice(): Promise<BinanceAPIAssetPrice[]> {
  const data: any = await binanceFetch('https://fapi.binance.com/fapi/v1/ticker/price', 'GET', false)
  return data
}
