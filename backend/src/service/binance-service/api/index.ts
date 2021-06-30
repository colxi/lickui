import fetch from 'node-fetch'
import { createHmac } from 'crypto'
import { getDateAsDDMMYYYY } from '@/lib/date'
import config from '@/config'
import {
  AssetPair,
  BinanceAPIAssetPrice,
  BinanceBalanceData,
  BinanceFuturesAPIOrder,
  BinanceFuturesAPIPosition
} from '@/types'


export interface BinanceTickData {
  totalBalance: number
  usedBalance: number,
  usedBalancePercent: number
  openOrders: number
  timestamp: number,
  date: string
}

export async function binanceFetch(requestUrl: string, method = 'GET', passUrlParams = true): Promise<any> {
  const [url, userQueryString] = requestUrl.split('?')
  const queryString = `${userQueryString ? userQueryString + '&' : ''}timestamp=${Date.now()}`
  const signature = createHmac("sha256", config.binanceApiSecret)
    .update(queryString)
    .digest("hex")
  const effectiveUrl = passUrlParams
    ? `${url}?${queryString}&signature=${signature}`
    : `${requestUrl}`
  const response = await fetch(
    effectiveUrl,
    {
      method: method,
      headers: { "X-MBX-APIKEY": config.binanceApiKey }
    }
  )
  let data: any
  try {
    data = await response.json()
  } catch (e) {
    console.log(await response.text())
    throw new Error('Binance fetch invalid JSON response')
  }
  return data || []
}

export default class {


  /**
   * Returns : timezone, serverTime, rateLimits, exchangeFilters, symbols
   */
  static async getExchangeInfo(): Promise<any> {
    const data: any = await binanceFetch('https://api.binance.com/api/v3/exchangeInfo', 'GET', false)
    return data
  }


  static async getFuturesExchangeInfo(): Promise<any> {
    const data: any = await binanceFetch('https://fapi.binance.com/fapi/v1/exchangeInfo', 'GET', false)
    return data
  }

  static async getAssetsPrice(): Promise<BinanceAPIAssetPrice[]> {
    const data: any = await binanceFetch('https://fapi.binance.com/fapi/v1/ticker/price', 'GET', false)
    return data
  }

  static async getFuturesAccount(): Promise<any> {
    const data: any = await binanceFetch('https://fapi.binance.com/fapi/v2/account', 'GET')
    return data
  }

  static async createFuturesMarketOrder(payload: any): Promise<any> {
    const data: any = await binanceFetch(
      `https://fapi.binance.com/fapi/v1/order?symbol=${payload.symbol}&side=${payload.side}&type=${payload.type}&quantity=${payload.quantity}`,
      'POST'
    )
    return data
  }

  static async createFuturesLimitOrder(payload: any): Promise<any> {
    const request = `https://fapi.binance.com/fapi/v1/order?symbol=${payload.symbol}&side=${payload.side}&type=${payload.type}&quantity=${payload.quantity}&price=${payload.price}&timeInForce=${payload.timeInForce}`
    console.log(payload)
    const data: any = await binanceFetch(
      request,
      'POST'
    )
    return data
  }

  static async getFuturesOrderInfo(payload: any): Promise<any> {
    const data: any = await binanceFetch(
      `https://fapi.binance.com/fapi/v1/order?symbol=${payload.symbol}&origClientOrderId=${payload.origClientOrderId}`,
      'GET'
    )
    return data
  }

  static async getUserOpenFuturesOrders(): Promise<any> {
    const data: any = await binanceFetch(
      `https://fapi.binance.com/fapi/v1/openOrders`, 'GET'
    )
    return data
  }

  static async setFuturesSymbolLeverage(payload: any): Promise<any> {
    const data: any = await binanceFetch(
      `https://fapi.binance.com/fapi/v1/leverage?symbol=${payload.symbol}&leverage=${payload.leverage}`,
      'POST'
    )
    return data
  }

  static async setFuturesSymbolMarginType(payload: any): Promise<any> {
    const data: any = await binanceFetch(
      `https://fapi.binance.com/fapi/v1/marginType?symbol=${payload.symbol}&marginType=${payload.marginType}`,
      'POST'
    )
    return data
  }

  static async getFuturesOpenPosition(): Promise<BinanceFuturesAPIPosition[]> {
    const data: any = await binanceFetch('https://fapi.binance.com/fapi/v2/account', 'GET')
    return data.positions.filter((i: any) => Number(i.initialMargin) > 0)
  }

  static async getOpenFutureOrders(): Promise<BinanceFuturesAPIOrder[]> {
    return await binanceFetch('https://fapi.binance.com/fapi/v1/openOrders')
  }

  static async getLastWeekFutureOrders(symbol: AssetPair): Promise<BinanceFuturesAPIOrder[]> {
    // docs: https://binance-docs.github.io/apidocs/futures/en/#all-orders-user_data
    return await binanceFetch(`https://fapi.binance.com/fapi/v1/allOrders?limit=1000&symbol=${symbol}`, 'GET')
  }

  static async getFuturesUserDataKey(): Promise<string> {
    const data: any = await binanceFetch('https://fapi.binance.com/fapi/v1/listenKey', 'POST', false)
    return data['listenKey']
  }

  static async getUserCommissionRates(): Promise<any> {
    const data: any = await binanceFetch('https://fapi.binance.com/fapi/v1/commissionRate', 'GET')
    return data
  }

  static async getUserDataKey(): Promise<string> {
    // docs https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md#user-data-stream-endpoints
    const data: any = await binanceFetch('https://api.binance.com/api/v3/userDataStream', 'POST', false)
    return data['listenKey']
  }

  static async getFuturesBalance(): Promise<BinanceBalanceData> {
    const data = await binanceFetch('https://fapi.binance.com/fapi/v2/balance')
    const USDTSymbol = data.filter((i: any) => i.asset === 'USDT')[0]
    return {
      totalBalance: Number(USDTSymbol.balance),
      availableBalance: Number(USDTSymbol.availableBalance)
    }
  }

  static async getBinanceData(): Promise<BinanceTickData> {
    const balance = await this.getFuturesBalance()

    const usedBalance = balance.totalBalance - balance.availableBalance
    const usedBalancePercent = usedBalance * 100 / balance.totalBalance

    const openOrders: any = await this.getOpenFutureOrders()

    return {
      totalBalance: balance.totalBalance,
      usedBalance: usedBalance,
      usedBalancePercent: Number(usedBalancePercent.toFixed(2)),
      openOrders: openOrders.length,
      timestamp: Date.now(),
      date: getDateAsDDMMYYYY()
    }
  }
}
