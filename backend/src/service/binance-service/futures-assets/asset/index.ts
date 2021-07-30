import { calculateTypicalPrice, calculateVWAP } from '@/lib/indicators'
import Logger from '@/lib/logger'
import { AssetName, CurrencyAmount, Immutable } from '@/types'
import { AssetCandle } from '../types'
import { AssetOptions } from './types'


/**
 * 
 * The Asset Entity holds candles and provides several methods and getters 
 * to retrieve common indicators values
 * 
 */
export default class Asset {
  constructor(options: AssetOptions) {
    this.#validateOptions(options)
    this.#assetName = options.assetName
    this.#candles = options.candles
    this.#maxCandles = options.maxCandles
    this.#logger = options.logger
    this.#quantityPrecision = options.quantityPrecision
  }


  readonly #logger: Logger
  readonly #maxCandles: number
  readonly #quantityPrecision: number
  readonly #assetName: AssetName
  readonly #candles: AssetCandle[]


  /**
   * 
   * Return the asset name
   * 
   */
  public get assetName(): AssetName {
    return this.#assetName
  }

  /**
   * 
   *  Return the current asset price (current candle.close value)
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
   * Returns asset quantity precision (amount of decimals supported)
   * 
   */
  public get quantityPrecision(): number {
    return this.#quantityPrecision
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
   * Updates the last candle, or creates a new candle when represents a new 
   * time period
   * 
   */
  public updateAsset(newCandle: AssetCandle): void {
    const lastCandle = this.#candles[this.candlesCount]
    if (newCandle.openTime < lastCandle.openTime) {
      this.#logger.log(`Provided ${this.assetName} candle openTime is older than last candle openTime. Ignoring it`)
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

  /**
  * 
  * Throw an Error if options are not valid
  * 
  */
  #validateOptions = (options: AssetOptions): void => {
    if (!options.candles) {
      throw new Error(`Asset ${options.assetName} cannot be initialized without candles`)
    }
    if (options.maxCandles < 1) {
      throw new Error(`Asset ${options.assetName} requires maxCandles value to be greater than 1`)
    }
    if (options.assetName.trim() === '') {
      throw new Error(`Detected empty Asset name. Cannot initialize Asset`)
    }
  }

}

