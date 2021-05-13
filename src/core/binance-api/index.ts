import fetch from 'node-fetch'
import { createHmac } from 'crypto'
import getNormalizedDate from '@/core/lib/normalizedDate'
import config from '@/core/config'

interface BinanceBalanceData {
  totalBalance: number
  availableBalance: number
  unrealizedLosts: number
}

export default class {
  static async binanceFetch(url: string): Promise<object> {
    const timestamp = Date.now()
    const queryString = `timestamp=${timestamp}`
    const signature = createHmac("sha256", config.binanceApiSecret)
      .update(queryString)
      .digest("hex")
    const response = await fetch(
      `${url}?${queryString}&signature=${signature}`,
      { method: "GET", headers: { "X-MBX-APIKEY": config.binanceApiKey } }
    )
    const data: any = await response.json()
    return data || []
  }

  static async getFuturesBalance(): Promise<BinanceBalanceData> {
    let data: any
    try {
      data = await this.binanceFetch('https://fapi.binance.com/fapi/v2/balance')
    } catch (e) {
      console.log("Failed:", e)
    }
    const USDTSymbol = data.filter((i: any) => i.asset === 'USDT')[0]
    console.log(USDTSymbol)
    return {
      totalBalance: Number(USDTSymbol.balance),
      availableBalance: Number(USDTSymbol.availableBalance),
      unrealizedLosts: Number(USDTSymbol.crossUnPnl) >= 0 ? 0 :Math.abs(Number(USDTSymbol.crossUnPnl))
    }
  }

  static async getOpenFutureOrders(): Promise<any> {
    let data: any
    try {
      data = await this.binanceFetch('https://fapi.binance.com/fapi/v1/openOrders')
    } catch (e) {
      console.log("Failed:", e)
    }
    return data
  }

  static async getBinanceData(): Promise<any> {
    const balance = await this.getFuturesBalance()
    const usedBalance = balance.totalBalance - balance.availableBalance
    const usedBalancePercent = usedBalance * 100 / balance.totalBalance
    const unrealizedLostsPercent = balance.unrealizedLosts * 100 / balance.availableBalance
    
    const openOrders: any = await this.getOpenFutureOrders()

    return {
      totalBalance: balance.totalBalance,
      usedBalance: usedBalance,
      unrealizedLosts: balance.unrealizedLosts,
      unrealizedLostsPercent:  Number(unrealizedLostsPercent.toFixed(2)),
      usedBalancePercent: Number(usedBalancePercent.toFixed(2)),
      openOrders: openOrders.length,
      timestamp: Date.now(),
      date: getNormalizedDate()
    }
  }
}
