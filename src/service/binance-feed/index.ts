
import binanceApi from '@/core/binance-api'
import config from '@/core/config'
import database from '@/core/database'


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
      await this.saveDatapoint(datapoint)
    } catch (e) {
      console.log('failed to fetch binance data. Binance API ERR', e.message)
    }
    // fetch positions
    try {
      await this.updateOpenPositions()
    } catch (e) {
      console.log('Failed to fetch open positions. Binance API ERR')
    }
  }

  public static async getPositionsHistory(dateStart:number){
    //
  }

  public static async getOpenPositions(){
    //
  }

  public static async getDatapointsHistory(){
    //
  }

  private static async updateOpenPositions(): Promise<void> {
    const positions: any = await binanceApi.getOpenFuturesPositions()
    
    // iterate cachedPositions and try to match it with fetched positions
    for (const cachedPosition of Object.values(this.cachePositions) as any[]) {
      const symbol: string = cachedPosition.symbol
      const fetchPosition = positions.find((i: any) => i.symbol === symbol)
      // cached position with same symbol already exists
      if (fetchPosition) {
        if (this.isNewPosition(fetchPosition)) {
          await this.closePosition(cachedPosition)
          await this.createPosition(fetchPosition)
        } else {
          await this.updatePosition(fetchPosition)
        }
      }
      // cached position does not exist in fetched positions
      else await this.closePosition(cachedPosition)
    }

    // iterate fetched positions and insert any missing (new) position
    for (const fetchPosition of positions) {
      if (!this.cachePositions[fetchPosition.symbol]) await this.createPosition(fetchPosition)
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

  private static async createPosition(position: any) {
    this.cachePositions[position.symbol] = {
      ...position,
      creationTime: position.updateTime
    }
    console.log('CREATED', this.cachePositions[position.symbol].symbol)

  }

  private static async updatePosition(position: any) {
    // update cached position
    this.cachePositions[position.symbol] = {
      ...position,
      creationTime: this.cachePositions[position.symbol].creationTime
    }
    console.log('UPDATED', this.cachePositions[position.symbol].symbol)
  }

  private static async closePosition(position: any) {
    const cachedPosition = this.cachePositions[position.symbol]
    // extract closed position from cache
    const duration = Date.now() - cachedPosition.creationTime
    delete this.cachePositions[position.symbol]
    console.log('CLOSED', cachedPosition.symbol)
    await this.savePosition(cachedPosition, duration)
  }

  private static async savePosition(position:any, duration:number){
   // return true;
    const queryStr = `
      INSERT INTO positions (
        timestamp,
        duration,
        symbol,
        amount,
        size,
        takeProfit,
        leverage
      )
      VALUES(
        ${position.creationTime},
        ${duration},
        "${position.symbol.slice(0,-4)}",
        ${Math.abs(Number(position.positionAmt) * Number(position.markPrice))},
        ${Number(position.positionAmt)},
        ${config.takeProfit},
        ${Number(position.leverage)}
      )
    `

    console.log('SAVING closed', queryStr)
    try{
      await database.query(queryStr)
    }catch(e){
      console.log('ERROR SAVING POSITION DB\n', queryStr)
      throw e
    }
  }

  public static async saveDatapoint(datapoint: any) {
    const queryStr = `INSERT INTO datapoints (
        totalBalance,
        unrealizedLosts,
        unrealizedLostsPercent,
        usedBalance,
        usedBalancePercent, 
        openOrders, 
        timestamp, 
        date 
      )
      VALUES(
        ${datapoint.totalBalance},
        ${datapoint.unrealizedLosts},
        ${datapoint.unrealizedLostsPercent},
        ${datapoint.usedBalance},
        ${datapoint.usedBalancePercent},
        ${datapoint.openOrders},
        ${datapoint.timestamp}, 
        "${datapoint.date}"
      )
    `
    try{
      await database.query(queryStr)
    }catch(e){
      console.log('ERROR SAVING IN DB\n', queryStr)
      throw e
    }
  }
}



