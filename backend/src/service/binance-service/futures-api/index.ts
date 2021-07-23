import fetch from 'node-fetch'
import { createHmac } from 'crypto'
import { getDateAsDDMMYYYY, TimeInMillis } from '@/lib/date'
import config from '@/config'
import {
  AssetName,
  BinanceFuturesAPIOrder,
  BinanceFuturesAPIPosition
} from '@/types'
import {
  GetAssetPairCandlesOptions,
  BinanceFuturesApiExchangeInfo,
  BinanceFuturesApiAssetCandle,
  BinanceFuturesApiServerTime,
  BinanceFuturesApiUserDataKey,
  BinanceFuturesApiBalanceData
} from './types'
import { sleep } from '@/lib/sleep'
import Logger from '@/lib/logger'


export default class FuturesApiService {
  constructor(options: { logger: Logger }) {
    this.#logger = options.logger

    this.#minuteWeightUsedResetTimer = null
    this.#minuteWeightLimit = 0
    this.#minuteWeightUsed = 0
  }


  readonly #logger: Logger
  #minuteWeightLimit: number
  #minuteWeightUsed: number
  #minuteWeightUsedResetTimer: NodeJS.Timeout | null


  public async start(): Promise<void> {
    // get exchange limits and current server time
    const exchangeInfo = await this.getFuturesExchangeInfo()
    this.#minuteWeightLimit = exchangeInfo.rateLimits[0].limit

    const serverTime = await this.getServerTime()

    // Block if time difference with binance server is greater than 1 second
    const timeDifferenceInMillis = Date.now() - serverTime
    if (timeDifferenceInMillis > 1000) {
      throw new Error('Time difference with server is >1000ms. Cannot start client')
    }

    // when the current minute finishes, start an interval to reset to 0 the used
    // weigh every 60 seconds (the same way binance do).
    const timeUntilCurrentMinuteFinishesInMillis = (60 - new Date().getSeconds()) * 1000
    setTimeout(
      () => {
        this.#minuteWeightUsed = 0
        this.#minuteWeightUsedResetTimer = setInterval(
          () => this.#minuteWeightUsed = 0,
          TimeInMillis.ONE_MINUTE
        )
      },
      timeUntilCurrentMinuteFinishesInMillis
    )
  }

  public async stop(): Promise<void> {
    this.#minuteWeightUsed = 0
    clearInterval(this.#minuteWeightUsedResetTimer!)
  }


  /**
   * 
   * 
   * 
   */
  #binanceFetch = async (
    requestUrl: string,
    method = 'GET',
    passUrlParams = true
  ): Promise<any> => {
    // prevent running out of api quota by spacing requests according to the available 
    // quota and remaining ime until next quota reset
    if (this.#minuteWeightLimit) {
      const minuteRemainingSeconds = 60 - new Date().getSeconds()
      const delayRequestInSec = this.#minuteWeightUsed * minuteRemainingSeconds / this.#minuteWeightLimit
      const delayRequestInMillis = Math.floor(delayRequestInSec * 1000)
      await sleep(delayRequestInMillis)
    }
    const [url, userQueryString] = requestUrl.split('?')

    this.#logger.log(`${this.#minuteWeightUsed}/${this.#minuteWeightLimit} - ${method} ${url}`)

    const queryString = `${userQueryString ? userQueryString + '&' : ''}timestamp=${Date.now()}`
    const signature = createHmac("sha256", config.binanceApiSecret).update(queryString).digest("hex")
    const effectiveUrl = passUrlParams
      ? `${url}?${queryString}&signature=${signature}`
      : `${requestUrl}`
    const response = await fetch(
      effectiveUrl,
      { method: method, headers: { "X-MBX-APIKEY": config.binanceApiKey } }
    )
    let data: any
    try {
      data = await response.json()
      const usedWeight = response.headers.get('x-mbx-used-weight-1m')
      if (usedWeight) {
        this.#minuteWeightUsed = Number(usedWeight)
      }
    } catch (e) {
      console.log(await response.text())
      throw new Error('Binance fetch invalid JSON response')
    }
    return data || []
  }


  /**
   * 
   * Get Binance server time
   * 
   */
  public async getServerTime(): Promise<number> {
    const data: BinanceFuturesApiServerTime = await this.#binanceFetch(
      'https://fapi.binance.com/fapi/v1/time',
      'GET',
      false
    )
    return data.serverTime
  }


  /**
   * 
   * Returns : timezone, serverTime, rateLimits, exchangeFilters, symbols
   * 
   */
  public async getFuturesExchangeInfo(): Promise<BinanceFuturesApiExchangeInfo> {
    return await this.#binanceFetch(
      'https://fapi.binance.com/fapi/v1/exchangeInfo',
      'GET',
      false
    )
  }


  /**
   * 
   * 
   * 
   */
  public async getFuturesAssetCandles({
    asset,
    interval,
    startTime,
    endTime = Date.now(),
    limit = 99
  }: GetAssetPairCandlesOptions): Promise<BinanceFuturesApiAssetCandle[]> {
    return await this.#binanceFetch(
      `https://fapi.binance.com/fapi/v1/klines?symbol=${asset}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=${limit}`,
      'GET',
      false
    )
  }


  /**
   * 
   * 
   */
  public async getFuturesUserDataKey(): Promise<string> {
    const data: BinanceFuturesApiUserDataKey = await this.#binanceFetch(
      'https://fapi.binance.com/fapi/v1/listenKey',
      'POST',
      false
    )
    return data.listenKey
  }


  /**
   * 
   * 
   */
  public async getFuturesBalance(): Promise<BinanceFuturesApiBalanceData> {
    const data = await this.#binanceFetch(
      'https://fapi.binance.com/fapi/v2/balance',
      'GET',
      true
    )
    const USDTCoin = data.filter((i: any) => i.asset === 'USDT')[0]
    return {
      totalBalance: Number(USDTCoin.balance),
      availableBalance: Number(USDTCoin.availableBalance)
    }
  }
}


// export interface BinanceTickData {
//   totalBalance: number
//   usedBalance: number,
//   usedBalancePercent: number
//   openOrders: number
//   timestamp: number,
//   date: string
// }


// export default class {


//   static async getFuturesExchangeInfo(): Promise<any> {
//     const data: any = await binanceFetch('https://fapi.binance.com/fapi/v1/exchangeInfo', 'GET', false)
//     return data
//   }

//   static async getFuturesAccount(): Promise<any> {
//     const data: any = await binanceFetch('https://fapi.binance.com/fapi/v2/account', 'GET')
//     return data
//   }

//   static async createFuturesMarketOrder(payload: any): Promise<any> {
//     const data: any = await binanceFetch(
//       `https://fapi.binance.com/fapi/v1/order?symbol=${payload.symbol}&side=${payload.side}&type=${payload.type}&quantity=${payload.quantity}`,
//       'POST'
//     )
//     return data
//   }

//   static async createFuturesLimitOrder(payload: any): Promise<any> {
//     const request = `https://fapi.binance.com/fapi/v1/order?symbol=${payload.symbol}&side=${payload.side}&type=${payload.type}&quantity=${payload.quantity}&price=${payload.price}&timeInForce=${payload.timeInForce}`
//     console.log(payload)
//     const data: any = await binanceFetch(
//       request,
//       'POST'
//     )
//     return data
//   }

//   static async getFuturesOrderInfo(payload: any): Promise<any> {
//     const data: any = await binanceFetch(
//       `https://fapi.binance.com/fapi/v1/order?symbol=${payload.symbol}&origClientOrderId=${payload.origClientOrderId}`,
//       'GET'
//     )
//     return data
//   }

//   static async getUserOpenFuturesOrders(): Promise<any> {
//     const data: any = await binanceFetch(
//       `https://fapi.binance.com/fapi/v1/openOrders`, 'GET'
//     )
//     return data
//   }

//   static async setFuturesSymbolLeverage(payload: any): Promise<any> {
//     const data: any = await binanceFetch(
//       `https://fapi.binance.com/fapi/v1/leverage?symbol=${payload.symbol}&leverage=${payload.leverage}`,
//       'POST'
//     )
//     return data
//   }

//   static async setFuturesSymbolMarginType(payload: any): Promise<any> {
//     const data: any = await binanceFetch(
//       `https://fapi.binance.com/fapi/v1/marginType?symbol=${payload.symbol}&marginType=${payload.marginType}`,
//       'POST'
//     )
//     return data
//   }

//   static async getFuturesOpenPosition(): Promise<BinanceFuturesAPIPosition[]> {
//     const data: any = await binanceFetch('https://fapi.binance.com/fapi/v2/account', 'GET')
//     return data.positions.filter((i: any) => Number(i.initialMargin) > 0)
//   }

//   static async getOpenFutureOrders(): Promise<BinanceFuturesAPIOrder[]> {
//     return await binanceFetch('https://fapi.binance.com/fapi/v1/openOrders')
//   }

//   static async getLastWeekFutureOrders(symbol: AssetName): Promise<BinanceFuturesAPIOrder[]> {
//     // docs: https://binance-docs.github.io/apidocs/futures/en/#all-orders-user_data
//     return await binanceFetch(`https://fapi.binance.com/fapi/v1/allOrders?limit=1000&symbol=${symbol}`, 'GET')
//   }


//   static async getUserCommissionRates(): Promise<any> {
//     const data: any = await binanceFetch('https://fapi.binance.com/fapi/v1/commissionRate', 'GET')
//     return data
//   }

//   static async getUserDataKey(): Promise<string> {
//     // docs https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md#user-data-stream-endpoints
//     const data: any = await binanceFetch('https://api.binance.com/api/v3/userDataStream', 'POST', false)
//     return data['listenKey']
//   }

//   static async getFuturesBalance(): Promise<BinanceBalanceData> {
//     const data = await binanceFetch('https://fapi.binance.com/fapi/v2/balance')
//     const USDTSymbol = data.filter((i: any) => i.asset === 'USDT')[0]
//     return {
//       totalBalance: Number(USDTSymbol.balance),
//       availableBalance: Number(USDTSymbol.availableBalance)
//     }
//   }

//   static async getBinanceData(): Promise<BinanceTickData> {
//     const balance = await this.getFuturesBalance()

//     const usedBalance = balance.totalBalance - balance.availableBalance
//     const usedBalancePercent = usedBalance * 100 / balance.totalBalance

//     const openOrders: any = await this.getOpenFutureOrders()

//     return {
//       totalBalance: balance.totalBalance,
//       usedBalance: usedBalance,
//       usedBalancePercent: Number(usedBalancePercent.toFixed(2)),
//       openOrders: openOrders.length,
//       timestamp: Date.now(),
//       date: getDateAsDDMMYYYY()
//     }
//   }
// }
