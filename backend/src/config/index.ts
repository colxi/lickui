// @ts-ignore
import lickuiConfig from '../../config.json'
// @ts-ignore
import _configKeys from '../../config.keys.json'
import { CryptoSymbol, Immutable } from '@/types'


export interface ConfigAssetDescriptor {
  asset: CryptoSymbol
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
  get assets(): Immutable<Record<CryptoSymbol, ConfigAssetDescriptor>> { return lickuiConfig.assets }

  public isAssetSupported(asset: CryptoSymbol): asset is keyof typeof lickuiConfig.assets {
    return asset in lickuiConfig.assets
  }

  public getEnabledAssetsList(): CryptoSymbol[] {
    const assets = Object.values(lickuiConfig.assets)
      .filter(i => i.enabled)
      .map(i => i.asset)
    return assets
  }

  // 
  public enableAsset(asset: CryptoSymbol): void {
    if (!this.isAssetSupported(asset)) {
      console.log('CryptoSymbol no suported', asset)
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
