import { config } from '@/config'
import Logger from '@/lib/logger'
import WebsocketConnection from '@/lib/websocket'
import { LoggerConfigs } from '../../logger.config'
import { AssetName } from '../../types'
import { isAssetCandleUpdateEvent } from './helpers'
import {
  FuturesAssetsSocketManagerConnectOptions,
  FuturesAssetsSocketManagerOptions,
  OnAssetCandleUpdateCallback
} from './types'


export default class FuturesAssetsSocketManager {
  constructor(options: FuturesAssetsSocketManagerOptions) {
    this.#logger = options.logger
    this.#onAssetCandleUpdateCallback = options.onAssetCandleUpdate
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
  readonly #onAssetCandleUpdateCallback: OnAssetCandleUpdateCallback

  public get isConnected(): boolean { return this.#socket.isConnected }

  /**
   * 
   * 
   */
  public async connect(options: FuturesAssetsSocketManagerConnectOptions): Promise<void> {
    return new Promise(resolve => {
      this.#logger.log('Starting socket...')
      this.#socket.onConnectCallback = (): void => {
        this.#subscribeToCandlesStream(options.assets)
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
  #subscribeToCandlesStream = (assets: AssetName[]): void => {
    this.#logger.log(`Subscribing to candles stream for ${assets.length} assets...`)
    const request = {
      "method": "SUBSCRIBE",
      "id": this.#socket.sentMessagesCount + 1,
      "params": [...assets.map(asset => `${asset.toLowerCase()}@kline_1m`)],
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
    if (!isAssetCandleUpdateEvent(message)) return
    this.#onAssetCandleUpdateCallback({
      assetName: message.s,
      open: Number(message.k.o),
      close: Number(message.k.c),
      high: Number(message.k.h),
      low: Number(message.k.l),
      volume: Number(message.k.v),
      openTime: message.k.t,
      closeTime: message.k.T
    })
  }
}

