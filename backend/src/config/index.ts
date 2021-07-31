// @ts-ignore
import lickuiConfig from '../../config.json'
// @ts-ignore
import _configKeys from '../../config.keys.json'
import { BinanceMarginType, CoinName, Immutable } from '@/types'


export interface ConfigAssetDescriptor {
  asset: CoinName
  longOffset: number
  shortOffset: number
  lickValue: number
  enabled: boolean
}

const _config = {
  ...lickuiConfig,
  ..._configKeys
}

export default _config


class Config {
  constructor() {
    //
  }

  // CREDENTIALS 

  get binanceApiKey(): string { return _configKeys.binanceApiKey }
  get binanceApiSecret(): string { return _configKeys.binanceApiSecret }
  get taapiApiKey(): string { return _configKeys.taapiApiKey }
  get assets(): Immutable<Record<CoinName, ConfigAssetDescriptor>> { return lickuiConfig.assets }
  get futuresLeverage(): number { return lickuiConfig.futuresLeverage }
  get futuresMarginType(): BinanceMarginType { return lickuiConfig.futuresMarginType as BinanceMarginType }

  public isAssetSupported(asset: CoinName): asset is keyof typeof lickuiConfig.assets {
    return asset in lickuiConfig.assets
  }

  public getEnabledAssetsList(): CoinName[] {
    const assets = Object.values(lickuiConfig.assets)
      .filter(i => i.enabled)
      .map(i => i.asset)
    return assets
  }

  // 
  public enableAsset(asset: CoinName): void {
    if (!this.isAssetSupported(asset)) {
      console.log('CoinName no suported', asset)
      return
    }

    lickuiConfig.assets[asset].enabled = true
    this.saveData()
    //this.EventDispatch
  }

  private saveData(): void {
    //
  }
}

export const config = new Config()
