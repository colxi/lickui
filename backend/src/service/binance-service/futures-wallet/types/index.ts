import Logger from '@/lib/logger'
import { AccountUpdateEventType, CurrencyAmount, Timestamp } from '@/types'
import FuturesApiService from '../../futures-api'

export interface FuturesWalletServiceOptions {
  api: FuturesApiService
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

