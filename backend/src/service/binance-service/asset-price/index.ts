import binanceApi from '@/api/binance'
import Logger from '@/lib/logger'
import { AccountUpdateEventType, Asset, AssetPair, BinanceAPIAssetPrice, BinanceBalanceData, CurrencyAmount, Immutable, Timestamp } from '@/types'
import FuturesSocketService from '@/service/binance-service/sockets/futures-socket'
import PricesSocketService from '../sockets/prices-socket'
import { config } from '@/config'
import { AssetPriceUpdateEventData } from '../sockets/prices-socket/types'


interface AssetStatusDescriptor {
  asset: Asset
  assetPair: AssetPair
  price: CurrencyAmount
  lastUpdate: Timestamp
}

export default class AssetPriceService {
  constructor(pricesSocketService: PricesSocketService) {
    this.#pricesSocketService = pricesSocketService
    this.#assets = {}
    this.onAssetPriceUpdate = this.onAssetPriceUpdate.bind(this)
  }

  #pricesSocketService: PricesSocketService
  #assets: Record<Asset, AssetStatusDescriptor> = {}

  public getAssetInfo(asset: Asset): Immutable<AssetStatusDescriptor> | null {
    if (asset in this.#assets) return null
    return this.#assets[asset]
  }

  private async fetchAllAssetPrices(): Promise<Record<Asset, AssetStatusDescriptor>> {
    this.logger.notification('Fetching all assets prices...')
    const assetsPrices: Record<Asset, AssetStatusDescriptor> = {}
    const binanceAssetsPrices: BinanceAPIAssetPrice[] = await binanceApi.getAssetsPrice()
    const enabledAssets = config.getEnabledAssetsList()
    for (const asset of binanceAssetsPrices) {
      const assetName: Asset = asset.symbol.slice(0, -4)
      if (!enabledAssets.includes(assetName)) continue
      assetsPrices[assetName] = {
        asset: assetName,
        assetPair: asset.symbol,
        price: Number(asset.price),
        lastUpdate: asset.time
      }
    }
    return assetsPrices
  }

  public async start(): Promise<void> {
    this.logger.notification('Starting service...')
    this.#assets = await this.fetchAllAssetPrices()
    this.#pricesSocketService.subscribe(
      this.#pricesSocketService.Event.ASSET_PRICE_UPDATE,
      this.onAssetPriceUpdate
    )
  }

  public async stop(): Promise<void> {
    this.#pricesSocketService.unsubscribe(
      this.#pricesSocketService.Event.ASSET_PRICE_UPDATE,
      this.onAssetPriceUpdate
    )
  }

  private onAssetPriceUpdate(priceUpdateEvent: AssetPriceUpdateEventData): void {
    const assetName: Asset = priceUpdateEvent.assetPair.slice(0, -4)
    this.#assets[assetName].price = priceUpdateEvent.price
    this.#assets[assetName].lastUpdate = priceUpdateEvent.timestamp
  }

  private logger = {
    notification(title: string, ...data: unknown[]): void {
      Logger.notification('✦ AssetPriceService', title, ...data)
    },
    warning(...data: unknown[]): void {
      Logger.warning('✦ AssetPriceService', ...data)
    }
  }
}
