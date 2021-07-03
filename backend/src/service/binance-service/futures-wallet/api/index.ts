import { binanceFetch } from '@/service/binance-service/api'
import { BinanceBalanceData } from '@/types'

export async function getFuturesUserDataKey(): Promise<string> {
  const data: any = await binanceFetch('https://fapi.binance.com/fapi/v1/listenKey', 'POST', false)
  return data['listenKey']
}


export async function getFuturesBalance(): Promise<BinanceBalanceData> {
  const data = await binanceFetch('https://fapi.binance.com/fapi/v2/balance')
  const USDTSymbol = data.filter((i: any) => i.asset === 'USDT')[0]
  return {
    totalBalance: Number(USDTSymbol.balance),
    availableBalance: Number(USDTSymbol.availableBalance)
  }
}