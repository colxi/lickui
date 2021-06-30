import Logger from '@/lib/logger'
import { WalletUpdateEventData } from '../../types'

export type OnWalletUpdateCallback = (eventData: WalletUpdateEventData) => void

export interface FuturesWalletSocketManagerOptions {
  logger: Logger
  onWalletUpdate: OnWalletUpdateCallback
}

