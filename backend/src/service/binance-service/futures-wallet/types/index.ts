import Logger from '@/lib/logger'
import { AccountUpdateEventType, CryptoAsset, CurrencyAmount, Timestamp } from '@/types'

export interface FuturesWalletServiceOptions {
  logger: Logger
}

export interface WalletUpdateEventData {
  timestamp: Timestamp
  totalBalance: CurrencyAmount
  availableBalance: CurrencyAmount
  type: AccountUpdateEventType
}

export const FuturesWalletServiceEvents = {
  WALLET_UPDATE: (eventData: WalletUpdateEventData): void => { void (eventData) },
}

export interface FuturesWalletServiceConfig {
  verbose: boolean,
  logger: (...args: any) => void
  events: typeof FuturesWalletServiceEvents
  onStart: () => Promise<void>
  onStop: () => Promise<void>
}

