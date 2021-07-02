import { binanceFetch } from '@/service/binance-service/api'

export async function getFuturesUserDataKey(): Promise<string> {
  const data: any = await binanceFetch('https://fapi.binance.com/fapi/v1/listenKey', 'POST', false)
  return data['listenKey']
}
