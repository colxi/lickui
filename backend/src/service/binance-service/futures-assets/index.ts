import Logger from '@/lib/logger'
import EventedService from '@/lib/evented-service'
import FuturesAssetsSocketManager from './socket-manager'
import { getAssetPairCandles } from './api'
import { LoggerConfigs } from '../helpers'
import Asset from './asset'
import {
  CryptoAsset,
  Immutable,
  CandlestickInterval,
  CurrencyAmount
} from '@/types'
import {
  BinanceAPIAssetCandle,
  CryptoAssetCandle,
  FuturesAssetsServiceConfig,
  FuturesAssetsServiceEvents,
  FuturesAssetsServiceOptions
} from './types'
import { TimeInMillis } from '@/lib/date'


// Max asset candles collection size 
const MAX_ASSET_CANDLES_COLLECTION = 99
// Value used in the asset candle initial request (max allowed 1500)
const INITIAL_CANDLE_FETCH_COLLECTION_AMOUNT = 99


/**
 * When setting the INITIAL_CANDLE_COLLECTION_SIZE value, consider the weight 
 * cost for each request to the candles API, as it can escalate 
 * very fast when requesting a big collection of assets. Once cumulated weight over 
 * calls exceeds the minute limits, requests will be rejected.
 * 
 * CANDLES    WEIGHT
 * < 100     	1
 * < 500	    2
 * < 1000    	5
 * > 1000	    10
 */

export default class FuturesAssetsService extends EventedService<FuturesAssetsServiceConfig>{
  constructor(options: FuturesAssetsServiceOptions) {
    super({
      verbose: false,
      events: FuturesAssetsServiceEvents,
      logger: ((): (...args: any[]) => void => {
        const logger = options.logger.createChild(LoggerConfigs.serviceEvent)
        return (message: string, ...args: any[]): void => logger.log(message, ...args)
      })(),
      onStart: async (options) => {
        // options.assets = ['BTCUSDT']
        await this.#initAssets(options.assets)
        //await this.#assetSocketManager.connect({ assets: options.assets })
      },
      onStop: async () => {
        await this.#assetSocketManager.disconnect()
      }
    })

    this.#updateAsset = this.#updateAsset.bind(this)
    this.#logger = options.logger
    this.#assetSocketManager = new FuturesAssetsSocketManager({
      logger: this.#logger.createChild(LoggerConfigs.futuresAssetServiceSocketManager),
      onAssetCandleUpdate: this.#updateAsset
    })
    this.#assets = {}
  }

  #logger: Logger
  #assets: Record<CryptoAsset, Asset>
  #assetSocketManager: FuturesAssetsSocketManager


  /***
   * 
   * 
   */
  #initAssets = async (
    assets: CryptoAsset[]
  ): Promise<void> => {
    //  
    this.#assets = {}
    this.#logger.log(`Fetching last ${INITIAL_CANDLE_FETCH_COLLECTION_AMOUNT} hour (1h) candles for ${assets.length} assets ...`)

    // Request minute candles for each one of the assets 
    const candlesInitialTime = Date.now() - (INITIAL_CANDLE_FETCH_COLLECTION_AMOUNT * TimeInMillis.ONE_HOUR)

    for (const asset of assets) {
      const candles = await getAssetPairCandles({
        asset: asset,
        interval: CandlestickInterval.HOUR_1,
        startTime: candlesInitialTime,
        limit: INITIAL_CANDLE_FETCH_COLLECTION_AMOUNT
      })
      const normalizedCandles = candles.map((candle: BinanceAPIAssetCandle): CryptoAssetCandle => {
        const [openTime, open, high, low, close, volume, closeTime] = candle
        return {
          asset: asset,
          open: Number(open),
          high: Number(high),
          low: Number(low),
          close: Number(close),
          volume: Number(volume),
          openTime: openTime,
          closeTime: closeTime,
        }
      })
      this.#assets[asset] = new Asset(
        asset,
        normalizedCandles,
        MAX_ASSET_CANDLES_COLLECTION,
        this.#logger
      )
    }
  }

  /**
   * 
   * 
   */
  #updateAsset = (candle: CryptoAssetCandle) => {
    this.#assets[candle.asset].updateAsset(candle)
  }
}
