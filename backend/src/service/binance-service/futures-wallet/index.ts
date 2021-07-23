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
  CurrencyAmount,
} from '@/types'
import FuturesApiService from '../futures-api'

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
        const userDataKey = await this.#api.getFuturesUserDataKey()
        await this.#socketManager.connect(userDataKey)
      },
      onStop: async () => {
        await this.#socketManager.disconnect()
      }
    })

    this.#updateWallet = this.#updateWallet.bind(this)

    this.#api = options.api
    this.#logger = options.logger
    this.#socketManager = new FuturesWalletSocketManager({
      logger: this.#logger.createChild(LoggerConfigs.futuresWalletServiceSocketManager),
      onWalletUpdate: this.#updateWallet
    })
    this.#totalBalance = 0
    this.#availableBalance = 0
  }

  #totalBalance: CurrencyAmount
  #availableBalance: CurrencyAmount

  readonly #api: FuturesApiService
  readonly #logger: Logger
  readonly #socketManager: FuturesWalletSocketManager

  public get totalBalance(): CurrencyAmount { return this.#totalBalance }
  public get availableBalance(): CurrencyAmount { return this.#availableBalance }
  public get isSocketConnected(): boolean { return this.#socketManager.isConnected }


  /**
   * 
   * 
   */
  #initWallet = async (): Promise<void> => {
    this.#logger.log('Fetching futures wallet...')
    const futuresWallet = await this.#api.getFuturesBalance()
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
  #updateWallet = (
    eventData: WalletUpdateEventData,
    dispatchEvent: boolean = true
  ): void => {
    const balanceChangeSign = Math.sign(eventData.totalBalance - this.#totalBalance) >= 0 ? '+' : '-'
    const balanceChangeDiff = Math.abs(eventData.totalBalance - this.#totalBalance)
    this.#logger.log(
      'Updating wallet data',
      eventData.type === AccountUpdateEventType.BALANCE_FETCH
        ? ` - Current balance: ${eventData.totalBalance.toFixed(2)}$\n`
        : ` - Balance change: ${balanceChangeSign}${balanceChangeDiff.toFixed(2)}$\n`,
      ` - Data : ${JSON.stringify(eventData)}`
    )
    this.#totalBalance = eventData.totalBalance
    this.#availableBalance = eventData.availableBalance
    if (dispatchEvent) this.dispatchEvent(this.Event.WALLET_UPDATE, eventData)
  }
}
