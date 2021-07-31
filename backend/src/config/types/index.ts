import { AssetName, CoinName } from '@/types'

export interface ConfigAssetDescriptor {
  asset: AssetName
  baseAsset: CoinName
  longOffset: number
  shortOffset: number
  lickValue: number
  enabled: boolean
}
