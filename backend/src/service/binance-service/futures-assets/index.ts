import Logger from '@/lib/logger'
import EventedService from '@/lib/evented-service'
import FuturesAssetsSocketManager from './socket-manager'
import { getAssetCandles } from './api'
import { LoggerConfigs } from '../helpers'
import Asset from './asset'
import {
  AssetName,
  CandlestickInterval,
  Immutable,
} from '@/types'
import {
  BinanceAPIAssetCandle,
  AssetCandle,
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
    this.#assets = {}
    this.#logger = options.logger
    this.#assetSocketManager = new FuturesAssetsSocketManager({
      logger: this.#logger.createChild(LoggerConfigs.futuresAssetServiceSocketManager),
      onAssetCandleUpdate: this.#updateAsset
    })
  }


  #logger: Logger
  #assets: Record<AssetName, Asset>
  #assetSocketManager: FuturesAssetsSocketManager


  /**
   * 
   * Public access to the assets
   * 
   */
  get assets(): Immutable<Record<AssetName, Asset>> {
    return this.#assets
  }

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
    this.#assets = {}
    // Iterate the list of provided asset names
    for (const asset of assets) {
      // Fetch the candles fot the asset
      const candles = await getAssetCandles({
        asset: asset,
        interval: CandlestickInterval.HOUR_1,
        startTime: Date.now() - (INITIAL_CANDLE_FETCH_COLLECTION_AMOUNT * TimeInMillis.ONE_HOUR),
        limit: INITIAL_CANDLE_FETCH_COLLECTION_AMOUNT
      })
      const normalizedCandles = candles.map((candle: BinanceAPIAssetCandle): AssetCandle => {
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
      // initialize the asset
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
   * 
   */
  #updateAsset = (candle: AssetCandle): void => {
    this.#assets[candle.asset].updateAsset(candle)
  }
}
