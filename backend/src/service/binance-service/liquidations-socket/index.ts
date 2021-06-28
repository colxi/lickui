import WebsocketConnection from '@/lib/websocket'
import Logger from '@/lib/logger'
import EventedService from '@/lib/evented-service'
import { ServiceEventsDescriptor, ServiceName } from './types'
import config from '@/config'
import {
  isBinanceSocketEvent,
  socketLogger,
  isLiquidationsUpdateEvent
} from './helpers'
import {
  LiquidationsEventLiquidationsData,
} from '@/types'

export default class LiquidationsSocketService extends EventedService<typeof ServiceEventsDescriptor>{
  constructor() {
    super({
      events: ServiceEventsDescriptor,
      serviceName: ServiceName,
      verbose: true
    })

    this.#futuresSocket = new WebsocketConnection({
      host: config.binance.production.futuresWS,
      reconnectOnDisconnection: true,
      reconnectOnDisconnectionDelay: 2000,
      onConnectCallback: null, // defined in the `start` method
      onMessageCallback: (ws, msg): any => this.#onSocketMessage(ws, msg),
      logger: socketLogger
    })
  }

  readonly #futuresSocket: WebsocketConnection

  readonly #onSocketMessage = async (ws: WebsocketConnection, message: unknown): Promise<void> => {
    if (!isBinanceSocketEvent(message)) {
      this.logger.warning('Invalid LiquidationsSocket message', message)
      return
    }
    else if (isLiquidationsUpdateEvent(message)) {
      const liquidationsData: LiquidationsEventLiquidationsData = message.o
      this.onLiquidationsUpdate(liquidationsData)
    }
    else {
      this.logger.warning('Unhandled LiquidationsSocket event', message.e)
    }
  }

  public async start(): Promise<void> {
    this.logger.notification('Starting service...')
    return new Promise(resolve => {
      this.logger.notification('Starting socket...')
      this.#futuresSocket.onConnectCallback = (): void => {
        this.subscribeToLiquidationsStream()
        resolve()
      }
      this.#futuresSocket.connect()
    })
  }

  public stop(): void {
    this.logger.notification('Stopping service...')
    this.#futuresSocket.disconnect()
  }

  private subscribeToLiquidationsStream(): void {
    const enabledCoins = Object.values(config.coins).filter(i => i.enabled)
    this.logger.notification(`Subscribing to liquidations stream for ${enabledCoins.length} coins...`)
    // Binance will push snapshot data at a maximum frequency of 1 push per second
    this.#futuresSocket.send({
      "method": "SUBSCRIBE",
      "id": this.#futuresSocket.sentMessagesCount + 1,
      "params": [...enabledCoins.map(i => `${i.asset.toLowerCase()}usdt@forceOrder`)]
    })
  }

  private onLiquidationsUpdate(liquidationsData: LiquidationsEventLiquidationsData): void {
    this.dispatchEvent(
      this.Event.LIQUIDATIONS_UPDATE,
      {
        assetPair: liquidationsData.s,
        total: Number(liquidationsData.ap) * Number(liquidationsData.q),
        price: Number(liquidationsData.ap),
        quantity: Number(liquidationsData.q),
        side: liquidationsData.S,
      }
    )
  }

  private logger = {
    notification(title: string, ...data: unknown[]): void {
      Logger.notification(`✖︎ ${ServiceName}`, title, ...data)
    },
    warning(...data: unknown[]): void {
      Logger.warning(`✖︎ ${ServiceName}`, ...data)
    }
  }
}
