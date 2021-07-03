import Logger from '@/lib/logger'
import PricesSocketService from './socket-manager'
import { config } from '@/config'
import {
  CryptoSymbol,
  CryptoAsset,
  BinanceAPIAssetPrice,
  CurrencyAmount,
  Immutable,
  Timestamp
} from '@/types'
import { getAssetsPrice } from './api'
import { AssetPriceUpdateEventData, FuturesAssetsServiceConfig, FuturesAssetsServiceEvents, FuturesAssetsServiceOptions } from './types'
import EventedService from '@/lib/evented-service'
import { LoggerConfigs } from '../helpers'
import FuturesAssetsSocketManager from './socket-manager'

interface CryptoAssetDetails {
  symbol: CryptoSymbol
  asset: CryptoAsset
  price: CurrencyAmount
  lastUpdate: Timestamp
}

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
        await this.#initAssets(options.assets)
        await this.#assetSocketManager.connect()
      },
      onStop: async () => {
        await this.#assetSocketManager.disconnect()
      }
    })

    this.#updateAssetPrice = this.#updateAssetPrice.bind(this)
    this.#logger = options.logger
    this.#assetSocketManager = new FuturesAssetsSocketManager({
      logger: this.#logger.createChild(LoggerConfigs.futuresAssetServiceSocketManager),
      onAssetPriceUpdate: this.#updateAssetPrice
    })
    this.#assets = {}
  }

  #logger: Logger
  #assets: Record<CryptoAsset, CryptoAssetDetails>
  #assetSocketManager: PricesSocketService

  get assets(): Immutable<Record<CryptoAsset, CryptoAssetDetails>> { return this.#assets }


  /***
   * 
   * 
   */
  #initAssets = async (
    assets: CryptoAsset[]
  ): Promise<void> => {
    this.#assets = {}
    this.#logger.log(`Fetching details for ${assets.length} assets ...`)
    const binanceAssetsPrices: BinanceAPIAssetPrice[] = await getAssetsPrice()

    /**
     * Prevent initialization of non available assets
     */
    const binanceSymbols = binanceAssetsPrices.map(i => i.symbol)
    for (const asset of assets) {
      if (!binanceSymbols.includes(asset)) {
        throw new Error(`FuturesAssetsService: Asset ${asset} is not available in Binance Futures`)
      }
    }

    for (const currentAsset of binanceAssetsPrices) {
      if (!assets.includes(currentAsset.symbol)) continue
      this.#assets[currentAsset.symbol] = {
        asset: currentAsset.symbol,
        price: Number(currentAsset.price),
        symbol: currentAsset.symbol.slice(0, -4),
        lastUpdate: currentAsset.time
      }
    }
  }

  /**
   * 
   * 
   */
  #updateAssetPrice = (
    eventData: AssetPriceUpdateEventData,
    dispatchEvent: boolean = true
  ): void => {
    const targetAsset = this.#assets[eventData.asset]
    targetAsset.price = eventData.price
    targetAsset.lastUpdate = eventData.timestamp
    if (dispatchEvent) this.dispatchEvent(this.Event.ASSET_PRICE_UPDATE, eventData)
  }
}
