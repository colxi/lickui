
import binanceApi from '@/core/binance-api'
import config from '@/core/config'
import database from '@/core/database'
import datapoints from '@/core/datapoints'


export default class BinanceFeedService {

  public static cachePositions: any = {}

  public static async init() {
    console.log('Initializing database...')
    await database.init()
    console.log('Starting binance futures Feed...')
    setInterval(
      BinanceFeedService.cycle.bind(this),
      config.updateIntervalInMillis
    )
    // initial call
    await BinanceFeedService.cycle()
  }

  public static async cycle(): Promise<void> {
    // fetch binance account Data
    try {
      const datapoint = await binanceApi.getBinanceData()
      await datapoints.save(datapoint)
    } catch (e) {
      console.log('failed to fetch binance data. API ERR', e.message)
    }
    await this.updateOpenPositions()
    // fetch positions
  }

  public static async updateOpenPositions(): Promise<void> {
    let positions: any
    try {
      positions = await binanceApi.getOpenFuturesPositions()
    } catch (e) {
      console.log('Failed fetchin open positions')
      return
    }

    // iterate cachedPositions and try to match it with fetched positions
    for (const cachedPosition of Object.values(this.cachePositions) as any[]) {
      const symbol: string = cachedPosition.symbol
      const fetchPosition = positions.find((i: any) => i.symbol === symbol)
      // cached position with same symbol already exists
      if (fetchPosition) {
        if (this.isNewPosition(fetchPosition)) {
          this.closePosition(cachedPosition)
          this.createPosition(fetchPosition)
        } else {
          this.updatePosition(fetchPosition)
        }
      }
      // cached position does not exist in fetched positions
      else this.closePosition(cachedPosition)
    }

    // iterate fetched positions and insert any missing (new) position
    for (const fetchPosition of positions) {
      if (!this.cachePositions[fetchPosition.symbol]) this.createPosition(fetchPosition)
    }
  }

  private static isNewPosition(fetchPosition: any) {
    const cachedPosition = this.cachePositions[fetchPosition.symbol]
    const isSameType = Math.sign(fetchPosition.positionAmt) === Math.sign(cachedPosition.positionAmt)
    const isSmallerAmount = fetchPosition.positionAmt < cachedPosition.positionAmt
    const isSameAmount = fetchPosition.positionAmt === cachedPosition.positionAmt
    const isDifferentTime = fetchPosition.updateTime !== cachedPosition.updateTime
    const isNewPosition = !isSameType || isSmallerAmount || (isDifferentTime && isSameAmount)
    return isNewPosition
  }

  private static createPosition(position: any) {
    this.cachePositions[position.symbol] = {
      ...position,
      creationTime: position.updateTime
    }
    console.log('CREATED', this.cachePositions[position.symbol])

  }

  private static async updatePosition(position: any) {
    // update cached position
    this.cachePositions[position.symbol] = {
      ...position,
      creationTime: this.cachePositions[position.symbol].creationTime
    }
    console.log('UPDATED', this.cachePositions[position.symbol])
  }

  private static closePosition(position: any) {
    // extract closed position from cache
    const ellapsedTime = Date.now() - position.creationTime
    delete this.cachePositions[position.symbol]
    console.log('CLOSED', this.cachePositions[position.symbol])
  }
}


