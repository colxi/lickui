import Logger from '@/lib/logger'
import EventedService from '@/lib/evented-service'
import { TimeInMillis } from '@/lib/date'
import { LoggerConfigs } from '../helpers'
import FuturesAssetsSocketManager from './socket-manager'
import Asset from './asset'
import {
  AssetName,
  CandlestickInterval,
  Immutable,
} from '@/types'
import {
  AssetCandle,
  FuturesAssetsServiceConfig,
  FuturesAssetsServiceEvents,
  FuturesAssetsServiceOptions
} from './types'
import FuturesApiService from '../futures-api'


// Max asset candles collection size 
const MAX_ASSET_CANDLES_COLLECTION = 99
// Value used in the asset candle initial request (max allowed 1500)
const INITIAL_CANDLE_FETCH_COLLECTION_AMOUNT = 99


/**
 * When setting the INITIAL_CANDLE_COLLECTION_SIZE value, consider the weight 
 * cost for each request to the candles API, as it can escalate 
 * very fast when requesting a big collection of assets. Once cumulated weight over 
 * calls exceeds the minute limits, requests will be rejected.
 * Source : https://binance-docs.github.io/apidocs/futures/en/#kline-candlestick-data
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
      onStart: async ({ assets }) => {
        await this.#initAssets(assets)
        await this.#socketManager.connect({ assets })
      },
      onStop: async () => {
        await this.#socketManager.disconnect()
      }
    })

    this.#api = options.api
    this.#logger = options.logger
    this.#asset = {}
    this.#socketManager = new FuturesAssetsSocketManager({
      logger: this.#logger.createChild(LoggerConfigs.futuresAssetServiceSocketManager),
      onAssetCandleUpdate: (candle: AssetCandle): void => this.#asset[candle.assetName].updateAsset(candle)
    })
  }


  #api: FuturesApiService
  #logger: Logger
  #asset: Record<AssetName, Asset>
  #socketManager: FuturesAssetsSocketManager


  public get asset(): Immutable<Record<AssetName, Asset>> { return this.#asset }
  public get isSocketConnected(): boolean { return this.#socketManager.isConnected }

  /***
   * 
   * Initialize the list of provided assets
   * 
   */
  #initAssets = async (
    assets: AssetName[]
  ): Promise<void> => {
    this.#logger.log(`Fetching last ${INITIAL_CANDLE_FETCH_COLLECTION_AMOUNT} hour (1h) candles for ${assets.length} assets ...`)
    // reset all asset instances
    this.#asset = {}
    // Iterate the list of provided asset names
    for (const assetName of assets) {
      // Fetch the candles fot the asset
      const candles = await this.#api.getFuturesAssetCandles({
        asset: assetName,
        interval: CandlestickInterval.HOUR_1,
        startTime: Date.now() - (INITIAL_CANDLE_FETCH_COLLECTION_AMOUNT * TimeInMillis.ONE_HOUR),
        limit: INITIAL_CANDLE_FETCH_COLLECTION_AMOUNT
      })
      const normalizedCandles = candles.map(
        ([openTime, open, high, low, close, volume, closeTime]): AssetCandle => {
          return {
            assetName,
            openTime,
            closeTime,
            open: Number(open),
            high: Number(high),
            low: Number(low),
            close: Number(close),
            volume: Number(volume),
          }
        })
      // initialize the asset
      this.#asset[assetName] = new Asset({
        assetName: assetName,
        candles: normalizedCandles,
        maxCandles: MAX_ASSET_CANDLES_COLLECTION,
        logger: this.#logger
      })
    }
  }
}