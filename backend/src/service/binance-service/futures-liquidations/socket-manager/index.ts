import config from '@/config'
import Logger from '@/lib/logger'
import WebsocketConnection from '@/lib/websocket'
import { AssetName } from '@/types'
import { LoggerConfigs } from '../../helpers'
import { isLiquidationsUpdateEvent } from './helpers'
import {
  FuturesLiquidationsSocketManagerConnectOptions,
  FuturesLiquidationsSocketManagerOptions, OntLiquidationUpdateCallback,
} from './types'


export default class FuturesLiquidationsSocketManager {
  constructor(options: FuturesLiquidationsSocketManagerOptions) {
    this.#logger = options.logger
    this.#onLiquidationUpdateCallback = options.onLiquidationUpdate
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
  #socket: WebsocketConnection
  #onLiquidationUpdateCallback: OntLiquidationUpdateCallback

  public get isConnected(): boolean { return this.#socket.isConnected }

  /**
   * 
   * 
   */
  public async connect(options: FuturesLiquidationsSocketManagerConnectOptions): Promise<void> {
    return new Promise(resolve => {
      this.#logger.log('Starting socket...')
      this.#socket.onConnectCallback = (): void => {
        this.#subscribeToLiquidationsStream(options.assets)
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
   * 
   */
  #subscribeToLiquidationsStream = (assets: AssetName[]): void => {
    this.#logger.log(`Subscribing to liquidations stream for ${assets.length} assets...`)
    const request = {
      "method": "SUBSCRIBE",
      "id": this.#socket.sentMessagesCount + 1,
      "params": [...assets.map(asset => `${asset.toLowerCase()}@forceOrder`)],
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
    if (!isLiquidationsUpdateEvent(message)) return
    this.#onLiquidationUpdateCallback({
      timestamp: message.E,
      assetName: message.o.s,
      total: Number(message.o.ap) * Number(message.o.q),
      price: Number(message.o.ap),
      quantity: Number(message.o.q),
      side: message.o.S,
    })
  }
}

