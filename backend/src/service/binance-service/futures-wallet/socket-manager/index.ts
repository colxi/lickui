import WebsocketConnection from '@/lib/websocket'
import { OnWalletUpdateCallback, FuturesWalletSocketManagerOptions } from './types'
import config from '@/config'
import { isAccountUpdateEvent } from './helpers'
import { AccountUpdateEventWalletData } from '@/types'
import Logger from '@/lib/logger'
import { LoggerConfigs } from '../../helpers'


export default class FuturesWalletSocketManager {
  constructor(options: FuturesWalletSocketManagerOptions) {
    this.#logger = options.logger
    this.#onWalletUpdateCallback = options.onWalletUpdate
    this.#onSocketMessage = this.#onSocketMessage.bind(this)
    const socketLogger = this.#logger.createChild(LoggerConfigs.socket)
    this.#socket = new WebsocketConnection({
      host: config.binance.production.futuresWS,
      reconnectOnDisconnection: true,
      reconnectOnDisconnectionDelay: 2000,
      onMessageCallback: this.#onSocketMessage,
      logger: (msg: any): void => socketLogger.log(msg)
    })
  }

  readonly #logger: Logger
  readonly #socket: WebsocketConnection
  readonly #onWalletUpdateCallback: OnWalletUpdateCallback

  public get isConnected(): boolean { return this.#socket.isConnected }

  /**
   * 
   * 
   */
  public async connect(userDataKey: string): Promise<void> {
    return new Promise(resolve => {
      this.#logger.log('Starting socket...')
      this.#socket.onConnectCallback = (): void => resolve()
      this.#socket.connect(userDataKey)
    })
  }

  /**
   * 
   * 
   */
  public async disconnect(): Promise<void> {
    this.#logger.log('Stopping manager...')
    this.#socket.disconnect()
  }

  /**
   * 
   * 
   */
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
}
