import Logger from '@/lib/logger'
import { CurrencyAmount, Timestamp } from '../../types'
import FuturesApiService from '../../futures-api'
import { BinanceWebsocketAccountUpdateEventType } from '../../futures-positions/socket-manager/types'

export interface FuturesWalletServiceOptions {
  api: FuturesApiService
  logger: Logger
}

export interface WalletUpdateEventData {
  timestamp: Timestamp
  totalBalance: CurrencyAmount
  availableBalance: CurrencyAmount
  type: BinanceWebsocketAccountUpdateEventType
}

export const FuturesWalletServiceEvents = {
  WALLET_UPDATE: (eventData: WalletUpdateEventData): void | Promise<void> => { void (eventData) },
}

export interface FuturesWalletServiceConfig {
  verbose: boolean,
  logger: (...args: any) => void
  events: typeof FuturesWalletServiceEvents
  onStart: () => Promise<void>
  onStop: () => Promise<void>
}

