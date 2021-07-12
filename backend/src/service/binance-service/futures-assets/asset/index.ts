import Logger from '@/lib/logger'
import { AssetName, CurrencyAmount, Immutable } from '@/types'
import { AssetCandle } from '../types'


function calculateTypicalPrice(candle: AssetCandle): number {
  return (candle.high + candle.low + candle.close) / 3
}

/**
 * 
 * VWAP indicator
 * Calculation : cumulative(typicalPrice * volume)/cumulative(volume)
 * 
 */
function calculateVWAP(candles: AssetCandle[]): number {
  // generate a collection of candles, containing each candle volume and  
  // normalized price ( hight + low + close / 3 )
  const normalizedCandles: Array<{ volume: number, price: number }> = candles.map(candle => {
    const typicalPrice = calculateTypicalPrice(candle)
    return { volume: candle.volume, price: typicalPrice }
  })

  // calculate VWAP
  const cumulativePricePerVolume = normalizedCandles.reduce((acc, candle) => acc + (candle.volume * candle.price), 0)
  const cumulativeVolume = normalizedCandles.reduce((acc, candle) => acc + candle.volume, 0) || 0
  const vwap = cumulativePricePerVolume / cumulativeVolume

  // done!
  return vwap
}

export default class Asset {
  constructor(assetPair: AssetName, candles: AssetCandle[], maxCandles: number, logger: Logger) {
    this.#assetPair = assetPair
    this.#candles = candles
    this.#maxCandles = maxCandles
    this.#logger = logger
  }

  readonly #logger: Logger
  readonly #maxCandles: number
  readonly #assetPair: AssetName
  readonly #candles: AssetCandle[]

  /**
   * 
   * 
   * 
   */
  public get assetPair(): AssetName {
    return this.#assetPair
  }

  /**
   * 
   * 
   */
  public get price(): CurrencyAmount {
    return this.lastCandle.close
  }

  /**
  * 
  * Returns asset typical price base din last candle
  * 
  */
  public get typicalPrice(): CurrencyAmount {
    return calculateTypicalPrice(this.lastCandle)
  }

  /**
   * 
   * Returns the amount of candles available in the collection
   * 
   */
  public get candlesCount(): number {
    return this.#candles.length - 1
  }

  /**
   * 
   * Returns last candle from asset candles collection
   * 
   */
  public get lastCandle(): Immutable<AssetCandle> {
    return this.#candles[this.candlesCount]
  }

  /**
   * 
   * Asset Last 24h vwap indicator value
   * 
   */
  public get vwap(): number {
    const anchorPeriod: number = 24
    const candles = this.#candles.slice(anchorPeriod * -1)
    if (anchorPeriod > candles.length) {
      this.#logger.log(`VWAP: requested period (${anchorPeriod}) is bigger than available sample (${candles.length})`)
    }
    return calculateVWAP(candles)
  }

  /**
   * 
   * 
   */
  public updateAsset(newCandle: AssetCandle): void {
    const lastCandle = this.#candles[this.candlesCount]
    if (newCandle.openTime < lastCandle.openTime) {
      this.#logger.log(`Provided ${this.assetPair} candle openTime is older than last candle openTime. Ignoring it`)
      return
    }
    else if (newCandle.openTime > lastCandle.openTime) {
      // If asset has no candles yet, or is a new candle entry, inject it
      // and dispatch an update event
      this.#candles.push(newCandle)
      // prevent asset candles collection to exceed maximum size, by removing 
      // oldest item when limit is reached
      if (this.candlesCount > this.#maxCandles) this.#candles.shift()
    }
    else {
      // otherwise, update the existing candle with the more recent 
      // asset market data
      lastCandle.high = newCandle.high
      lastCandle.low = newCandle.low
      lastCandle.open = newCandle.open
      lastCandle.close = newCandle.close
      lastCandle.volume = newCandle.volume
    }
  }

}

