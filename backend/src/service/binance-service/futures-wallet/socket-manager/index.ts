import WebsocketConnection from '@/lib/websocket'
import Logger from '@/lib/logger'
import binanceApi from '@/service/binance-service/api'
import { OnWalletUpdateCallback, FuturesWalletSocketManagerOptions } from './types'
import config from '@/config'
import { isAccountUpdateEvent } from './helpers'
import { AccountUpdateEventWalletData } from '@/types'


export default class FuturesWalletSocketManager {
  constructor(options: FuturesWalletSocketManagerOptions) {
    this.#contextName = 'FuturesWalletSocketManager'
    this.#onWalletUpdateCallback = options.onWalletUpdate
    this.#socket = new WebsocketConnection({
      host: config.binance.production.futuresWS,
      reconnectOnDisconnection: true,
      reconnectOnDisconnectionDelay: 2000,
      onMessageCallback: (ws, msg): any => this.#onSocketMessage(ws, msg),
      logger: (...args: any[]): void => {
        const subtitle = Logger.formatText({
          reset: false,
          color: 'green',
          background: 'black',
          text: '  WS ',
        })
        Logger.notification(
          `${this.#contextName} ${subtitle}`,
          `${args[0]}`
        )
      }
    })
  }

  #contextName: string
  #socket: WebsocketConnection
  #onWalletUpdateCallback: OnWalletUpdateCallback

  public get isConnected(): boolean { return this.#socket.isConnected }

  public async start(): Promise<void> {
    this.#logger('Starting manager...')
    const futuresWsKey = await this.#getBinanceWebsocketDataKey()
    return new Promise(resolve => {
      this.#logger('Starting socket...')
      this.#socket.onConnectCallback = (): void => resolve()
      this.#socket.connect(futuresWsKey)
    })
  }

  public async stop(): Promise<void> {
    this.#logger('Stopping manager...')
    this.#socket.disconnect()
  }

  #getBinanceWebsocketDataKey = async (): Promise<string> => {
    this.#logger('Fetching UserDataKey...')
    const futuresWsKey = await binanceApi.getFuturesUserDataKey()
    return futuresWsKey
  }

  #onSocketMessage = async (
    ws: WebsocketConnection,
    message: unknown
  ): Promise<void> => {
    if (!isAccountUpdateEvent(message)) return
    const eventData = message.a
    const eventTime = message.E
    const eventType = eventData.m
    const walletData = eventData.B.find((i: AccountUpdateEventWalletData) => i.a === 'USDT')
    if (walletData) {
      const totalBalance = Number(walletData.wb)
      const availableBalance = Number(walletData.cw)
      this.#onWalletUpdateCallback({
        timestamp: eventTime,
        totalBalance: totalBalance,
        availableBalance: availableBalance,
        type: eventType
      })
    }
  }

  #logger = (title: string, ...data: unknown[]): void => {
    Logger.notification(this.#contextName, title, ...data)
  }
}
