import { WalletUpdateEventData } from '../../types'

export type OnWalletUpdateCallback = (eventData: WalletUpdateEventData) => void

export interface FuturesWalletSocketManagerOptions {
  onWalletUpdate: OnWalletUpdateCallback
}

