import fs from 'fs'
import assetsConfig from './json/assets.json'
import generalConfig from './json/general.json'
import keysConfig from './json/keys.json'
import { AssetName, BinanceMarginType, Immutable } from '@/types'
import { ConfigAssetDescriptor } from './types'


class Config {
  constructor() {
    this.#assetsConfig = assetsConfig
    this.#generalConfig = generalConfig
    this.#keysConfig = keysConfig
  }

  #assetsConfig: Record<AssetName, ConfigAssetDescriptor>
  #generalConfig: typeof generalConfig
  #keysConfig: typeof keysConfig


  get assets(): Immutable<Record<AssetName, ConfigAssetDescriptor>> { return this.#assetsConfig }
  get futuresBinanceWS(): string { return this.#generalConfig.futuresBinanceWS }
  get futuresBinanceAPI(): string { return this.#generalConfig.futuresBinanceAPI }
  get binanceApiKey(): string { return this.#keysConfig.binanceApiKey }
  get binanceApiSecret(): string { return this.#keysConfig.binanceApiSecret }
  get taapiApiKey(): string { return this.#keysConfig.taapiApiKey }
  get futuresLeverage(): number { return this.#generalConfig.futuresLeverage }
  get futuresMarginType(): BinanceMarginType { return this.#generalConfig.futuresMarginType as BinanceMarginType }


  public getEnabledAssetsList(): AssetName[] {
    return Object.values(this.#assetsConfig)
      .filter(i => i.enabled)
      .map(i => i.asset)
  }


  #saveCoinsData = (coinsData: Record<AssetName, ConfigAssetDescriptor>): void => {
    console.log('aaa', __dirname)
    fs.writeFileSync(`${__dirname}/json/assets.json`, JSON.stringify(coinsData, null, 2))
  }


  #migrateLHConfig = (lhConfig: any): void => {
    const assets: any = {}
    for (const coin of lhConfig.coins) {
      assets[coin.symbol + 'USDT'] = {
        baseAsset: coin.symbol,
        asset: coin.symbol + 'USDT',
        longOffset: Number(coin.longoffset),
        shortOffset: Number(coin.shortoffset),
        lickValue: Number(coin.lickvalue),
        enabled: coin.var_enabled
      }
    }
    this.#saveCoinsData(assets)
  }
}

export const config = new Config()
