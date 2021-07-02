import binanceApi from '@/service/binance-service/api'
import FuturesWalletSocketManager from './socket-manager'
import EventedService from '@/lib/evented-service'
import { LoggerConfigs } from '../helpers'
import Logger from '@/lib/logger'
import {
  FuturesWalletServiceEvents,
  FuturesWalletServiceEventsConfig,
  FuturesWalletServiceOptions,
  WalletUpdateEventData
} from './types'
import {
  AccountUpdateEventType,
  BinanceBalanceData,
  CurrencyAmount,
} from '@/types'


export default class FuturesWalletService extends EventedService<
  FuturesWalletServiceEventsConfig
> {
  constructor(options: FuturesWalletServiceOptions) {
    super({
      verbose: true,
      events: FuturesWalletServiceEvents,
      logger: ((): (...args: any[]) => void => {
        const logger = options.logger.createChild(LoggerConfigs.serviceEvent)
        return (message: string, ...args: any[]): void => logger.log(message, ...args)
      })(),
      onStart: async () => {
        await this.#fetchBalances()
        await this.#walletSocketManager.connect()
      },
      onStop: async () => {
        await this.#walletSocketManager.disconnect()
        this.#totalBalance = 0
        this.#availableBalance = 0
      }
    })

    this.#logger = options.logger
    this.#updateWallet = this.#updateWallet.bind(this)
    this.#totalBalance = 0
    this.#availableBalance = 0
    this.#walletSocketManager = new FuturesWalletSocketManager({
      logger: this.#logger.createChild(LoggerConfigs.futuresWalletServiceSocketManager),
      onWalletUpdate: this.#updateWallet
    })
  }

  #logger: Logger
  #totalBalance: CurrencyAmount
  #availableBalance: CurrencyAmount
  #walletSocketManager: FuturesWalletSocketManager

  public get totalBalance(): CurrencyAmount { return this.#totalBalance }
  public get availableBalance(): CurrencyAmount { return this.#availableBalance }


  #fetchBalances = async (): Promise<void> => {
    this.#logger.log('Fetching futures wallet...')
    const futuresWallet: BinanceBalanceData = await binanceApi.getFuturesBalance()
    this.#updateWallet({
      timestamp: Date.now(),
      totalBalance: futuresWallet.totalBalance,
      availableBalance: futuresWallet.availableBalance,
      type: AccountUpdateEventType.BALANCE_FETCH
    })
  }

  #updateWallet = (eventData: WalletUpdateEventData): void => {
    this.#logger.log(
      'Updating wallet data',
      eventData.type === AccountUpdateEventType.BALANCE_FETCH
        ? ` - Current balance: ${eventData.totalBalance.toFixed(2)}$\n`
        : ` - Balance Change: ${Math.sign(eventData.totalBalance - this.#totalBalance)}${(Math.abs(eventData.totalBalance - this.#totalBalance)).toFixed(2)}$\n`,
      ` - Data : ${JSON.stringify(eventData)}`
    )
    this.#totalBalance = eventData.totalBalance
    this.#availableBalance = eventData.availableBalance
    this.dispatchEvent(
      this.Event.WALLET_UPDATE,
      eventData
    )
  }
}
