import binanceApi from '@/api/binance'
import Logger from '@/lib/logger'
import { AccountUpdateEventType, BinanceBalanceData, CurrencyAmount, Timestamp } from '@/types'
import FuturesSocketService from '@/service/binance-service/sockets/futures-socket'


interface WalletHistoryEntry {
  time: Timestamp
  type: AccountUpdateEventType,
  totalBalance: CurrencyAmount,
  availableBalance: CurrencyAmount
}

export default class FuturesWalletService {
  constructor(futuresSocketService: FuturesSocketService) {
    this.#futuresSocketService = futuresSocketService
    this.updateWallet = this.updateWallet.bind(this)
  }

  #futuresSocketService: FuturesSocketService
  #totalBalance: CurrencyAmount = 0
  #availableBalance: CurrencyAmount = 0
  #history: WalletHistoryEntry[] = []

  public get totalBalance(): CurrencyAmount { return this.#totalBalance }
  public get availableBalance(): CurrencyAmount { return this.#availableBalance }
  public get history(): WalletHistoryEntry[] { return this.#history }


  public async start(): Promise<void> {
    this.logger.notification('Starting service...')
    await this.fetchBalances()
    this.#futuresSocketService.subscribe(
      this.#futuresSocketService.Event.WALLET_UPDATE,
      this.updateWallet
    )
  }

  public async stop(): Promise<void> {
    this.#futuresSocketService.subscribe(
      this.#futuresSocketService.Event.WALLET_UPDATE,
      this.updateWallet
    )
  }

  public async fetchBalances(): Promise<void> {
    this.logger.notification('Fetching futures wallet...')
    const futuresWallet: BinanceBalanceData = await binanceApi.getFuturesBalance()
    this.updateWallet({
      totalBalance: futuresWallet.totalBalance,
      availableBalance: futuresWallet.availableBalance,
      type: AccountUpdateEventType.BALANCE_FETCH
    })
  }

  private updateWallet(e: Omit<WalletHistoryEntry, 'time'>): void {
    const eventMessage = e.type === AccountUpdateEventType.BALANCE_FETCH
      ? ` - Current balance: ${e.totalBalance.toFixed(2)}$\n`
      : ` - Balance Change: ${Math.sign(e.totalBalance - this.#totalBalance)}${(Math.abs(e.totalBalance - this.#totalBalance)).toFixed(2)}$\n`
    this.logger.notification(
      'Updating wallet data',
      eventMessage,
      ` - Data : ${JSON.stringify(e)}`
    )

    this.#totalBalance = e.totalBalance
    this.#availableBalance = e.availableBalance
    this.#history.push({
      time: Date.now(),
      type: '' as any,
      totalBalance: this.#totalBalance,
      availableBalance: this.#availableBalance
    })
  }

  private logger = {
    notification(title: string, ...data: unknown[]): void {
      Logger.notification('♥︎ BINANCE WALLET SERVICE', title, ...data)
    },
    warning(...data: unknown[]): void {
      Logger.warning('♦♥︎ BINANCE WALLET SERVICE', ...data)
    }
  }
}
