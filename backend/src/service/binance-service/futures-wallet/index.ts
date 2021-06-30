import binanceApi from '@/service/binance-service/api'
import Logger from '@/lib/logger'
import FuturesWalletSocketManager from './socket-manager'
import { FuturesWalletServiceEvents, WalletUpdateEventData } from './types'
import {
  AccountUpdateEventType,
  BinanceBalanceData,
  CurrencyAmount,
  ServiceStatus
} from '@/types'
import EventedService from '@/lib/evented-service'

export default class FuturesWalletService extends EventedService<typeof FuturesWalletServiceEvents> {
  constructor() {
    super({
      events: FuturesWalletServiceEvents,
      serviceName: 'FuturesWalletService',
      verbose: true
    })

    this.#updateWallet = this.#updateWallet.bind(this)
    this.#serviceStatus = ServiceStatus.STOPPED
    this.#totalBalance = 0
    this.#availableBalance = 0
    this.#walletSocketManager = new FuturesWalletSocketManager({
      onWalletUpdate: this.#updateWallet
    })
  }

  #serviceStatus: ServiceStatus
  #totalBalance: CurrencyAmount
  #availableBalance: CurrencyAmount
  #walletSocketManager: FuturesWalletSocketManager

  public get serviceStatus(): ServiceStatus { return this.#serviceStatus }
  public get totalBalance(): CurrencyAmount { return this.#totalBalance }
  public get availableBalance(): CurrencyAmount { return this.#availableBalance }

  public async start(): Promise<void> {
    this.#logger('Starting service...')
    if (this.#serviceStatus === ServiceStatus.RUNNING) return
    await this.#fetchBalances()
    await this.#walletSocketManager.start()
    this.#serviceStatus = ServiceStatus.RUNNING
  }

  public async stop(): Promise<void> {
    this.#logger('Stopping service...')
    if (this.#serviceStatus === ServiceStatus.STOPPED) return
    await this.#walletSocketManager.stop()
    this.#totalBalance = 0
    this.#availableBalance = 0
    this.#serviceStatus = ServiceStatus.STOPPED
  }

  #fetchBalances = async (): Promise<void> => {
    this.#logger('Fetching futures wallet...')
    const futuresWallet: BinanceBalanceData = await binanceApi.getFuturesBalance()
    this.#updateWallet({
      timestamp: Date.now(),
      totalBalance: futuresWallet.totalBalance,
      availableBalance: futuresWallet.availableBalance,
      type: AccountUpdateEventType.BALANCE_FETCH
    })
  }

  #updateWallet = (eventData: WalletUpdateEventData): void => {
    this.#logger(
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

  #logger = (title: string, ...data: unknown[]): void => {
    Logger.notification(this.serviceName, title, ...data)
  }
}
