import WebsocketConnection from '@/lib/websocket'
import binanceApi from '@/service/binance-service/api'
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
    const socketLogger = this.#logger.createChild(LoggerConfigs.socket)
    this.#socket = new WebsocketConnection({
      host: config.binance.production.futuresWS,
      reconnectOnDisconnection: true,
      reconnectOnDisconnectionDelay: 2000,
      onMessageCallback: (ws, msg): any => this.#onSocketMessage(ws, msg),
      logger: (msg: any): void => socketLogger.log(msg)
    })
  }

  #logger: Logger
  #socket: WebsocketConnection
  #onWalletUpdateCallback: OnWalletUpdateCallback

  public get isConnected(): boolean { return this.#socket.isConnected }

  public async start(): Promise<void> {
    this.#logger.log('Starting manager...')
    const futuresWsKey = await this.#getBinanceWebsocketDataKey()
    return new Promise(resolve => {
      this.#logger.log('Starting socket...')
      this.#socket.onConnectCallback = (): void => resolve()
      this.#socket.connect(futuresWsKey)
    })
  }

  public async stop(): Promise<void> {
    this.#logger.log('Stopping manager...')
    this.#socket.disconnect()
  }

  #getBinanceWebsocketDataKey = async (): Promise<string> => {
    this.#logger.log('Fetching UserDataKey...')
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
}
