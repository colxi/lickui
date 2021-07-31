import { config } from '@/config'
import Logger from '@/lib/logger'
import WebsocketConnection from '@/lib/websocket'
import { LoggerConfigs } from '../../helpers'
import { isAccountUpdateEvent, isOrderUpdateEvent } from './helpers'
import {
  FuturesPositionsSocketManagerOptions,
  OnPositionUpdateCallback,
} from './types'


export default class FuturesPositionsSocketManager {
  constructor(options: FuturesPositionsSocketManagerOptions) {
    this.#logger = options.logger
    this.#onPositionUpdateCallback = options.onPositionUpdate
    this.#onSocketMessage = this.#onSocketMessage.bind(this)
    const socketLogger = this.#logger.createChild(LoggerConfigs.socket)
    this.#socket = new WebsocketConnection({
      host: config.futuresBinanceWS,
      reconnectOnDisconnection: true,
      reconnectOnDisconnectionDelay: 2000,
      onMessageCallback: this.#onSocketMessage,
      logger: (msg: any): void => socketLogger.log(msg)
    })
  }

  readonly #logger: Logger
  readonly #socket: WebsocketConnection
  readonly #onPositionUpdateCallback: OnPositionUpdateCallback

  public get isConnected(): boolean { return this.#socket.isConnected }

  /**
   * 
   * 
   */
  public async connect(userDataKey: string): Promise<void> {
    return new Promise(resolve => {
      this.#logger.log('Starting socket...')
      this.#socket.onConnectCallback = (): void => { resolve() }
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

    if (isAccountUpdateEvent(message)) {
      console.log((message as any).e, (message as any).a.P)
      //
    } else if (isOrderUpdateEvent(message)) {
      console.log((message as any).e, (message as any).o?.x)
      //
    }
    // if (!isAccountUpdateEvent(message)) return
    // this.#onPositionUpdateCallback({
    //   timestamp: message.T,
    //   assetName: message.o.s,
    //   total: Number(message.o.ap) * Number(message.o.q),
    //   price: Number(message.o.ap),
    //   quantity: Number(message.o.q),
    //   side: message.o.S,
    // })
  }
}

