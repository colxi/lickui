import FuturesWalletSocketManager from './socket-manager'
import EventedService from '@/lib/evented-service'
import { LoggerConfigs } from '../helpers'
import Logger from '@/lib/logger'
import {
  FuturesWalletServiceEvents,
  FuturesWalletServiceConfig,
  FuturesWalletServiceOptions,
  WalletUpdateEventData
} from './types'
import {
  AccountUpdateEventType,
  BinanceBalanceData,
  CurrencyAmount,
} from '@/types'
import { getFuturesBalance } from './api'


export default class FuturesWalletService extends EventedService<
  FuturesWalletServiceConfig
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
        await this.#initWallet()
        await this.#walletSocketManager.connect()
      },
      onStop: async () => {
        await this.#walletSocketManager.disconnect()
      }
    })

    this.#updateWallet = this.#updateWallet.bind(this)
    this.#logger = options.logger
    this.#walletSocketManager = new FuturesWalletSocketManager({
      logger: this.#logger.createChild(LoggerConfigs.futuresWalletServiceSocketManager),
      onWalletUpdate: this.#updateWallet
    })
    this.#totalBalance = 0
    this.#availableBalance = 0
  }

  #logger: Logger
  #totalBalance: CurrencyAmount
  #availableBalance: CurrencyAmount
  #walletSocketManager: FuturesWalletSocketManager

  public get totalBalance(): CurrencyAmount { return this.#totalBalance }
  public get availableBalance(): CurrencyAmount { return this.#availableBalance }


  /**
   * 
   * 
   */
  #initWallet = async (): Promise<void> => {
    this.#logger.log('Fetching futures wallet...')
    const futuresWallet: BinanceBalanceData = await getFuturesBalance()
    this.#updateWallet({
      timestamp: Date.now(),
      totalBalance: futuresWallet.totalBalance,
      availableBalance: futuresWallet.availableBalance,
      type: AccountUpdateEventType.BALANCE_FETCH
    }, false)
  }

  /**
   * 
   * 
   */
  #updateWallet = (eventData: WalletUpdateEventData, dispatchEvent: boolean = true): void => {
    this.#logger.log(
      'Updating wallet data',
      eventData.type === AccountUpdateEventType.BALANCE_FETCH
        ? ` - Current balance: ${eventData.totalBalance.toFixed(2)}$\n`
        : ` - Balance Change: ${Math.sign(eventData.totalBalance - this.#totalBalance)}${(Math.abs(eventData.totalBalance - this.#totalBalance)).toFixed(2)}$\n`,
      ` - Data : ${JSON.stringify(eventData)}`
    )
    this.#totalBalance = eventData.totalBalance
    this.#availableBalance = eventData.availableBalance
    if (dispatchEvent) this.dispatchEvent(this.Event.WALLET_UPDATE, eventData)
  }
}
