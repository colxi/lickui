import Logger from '@/lib/logger'
import { AccountUpdateEventType, CurrencyAmount, Timestamp } from '@/types'

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

