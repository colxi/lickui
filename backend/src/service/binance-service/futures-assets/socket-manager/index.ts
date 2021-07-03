import config from '@/config'
import Logger from '@/lib/logger'
import WebsocketConnection from '@/lib/websocket'
import { LoggerConfigs } from '../../helpers'
import { isAssetUpdateEvent } from './helpers'
import {
  FuturesAssetsSocketManagerOptions,
  OnAssetPriceUpdateCallback
} from './types'


export default class FuturesAssetsSocketManager {
  constructor(options: FuturesAssetsSocketManagerOptions) {
    this.#logger = options.logger
    this.#onAssetPriceUpdateCallback = options.onAssetPriceUpdate
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

  #logger: Logger
  #onAssetPriceUpdateCallback: OnAssetPriceUpdateCallback
  #socket: WebsocketConnection

  public get isConnected(): boolean { return this.#socket.isConnected }

  /**
   * 
   * 
   */
  public async connect(): Promise<void> {
    this.#logger.log('Starting manager...')
    return new Promise(resolve => {
      this.#socket.onConnectCallback = (): void => {
        this.#subscribeToPricesStream()
        resolve()
      }
      this.#socket.connect()
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
   */
  #subscribeToPricesStream = (): void => {
    const enabledCoins = Object.values(config.assets).filter(i => i.enabled)
    this.#logger.log(`Subscribing to prices stream for ${enabledCoins.length} assets...`)
    const request = {
      "method": "SUBSCRIBE",
      "id": this.#socket.sentMessagesCount + 1,
      "params": [...enabledCoins.map(i => `${i.asset.toLowerCase()}usdt@markPrice@1s`)],
    }
    this.#socket.send(request)
  }

  /**
   * 
   * 
   */
  #onSocketMessage = async (
    ws: WebsocketConnection,
    message: unknown
  ): Promise<void> => {
    if (!isAssetUpdateEvent(message)) return
    this.#onAssetPriceUpdateCallback({
      timestamp: message.E,
      asset: message.s,
      price: Number(message.p)
    })
  }
}

