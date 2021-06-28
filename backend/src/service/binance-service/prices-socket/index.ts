import WebsocketConnection from '@/lib/websocket'
import Logger from '@/lib/logger'
import {
  isAssetPriceUpdateEvent,
  isBinanceSocketEvent,
  socketLogger
} from './helpers'
import EventedService from '@/lib/evented-service'
import { ServiceEventsDescriptor, ServiceName } from './types'
import config from '@/config'

export default class PricesSocketService extends EventedService<typeof ServiceEventsDescriptor>{
  constructor() {
    super({
      events: ServiceEventsDescriptor,
      serviceName: ServiceName,
      verbose: false
    })

    this.#pricesStreamSocket = new WebsocketConnection({
      host: config.binance.production.futuresWS,
      reconnectOnDisconnection: true,
      reconnectOnDisconnectionDelay: 2000,
      onConnectCallback: null, // defined in the `start` method
      onMessageCallback: (ws, msg): any => this.#onSocketMessage(ws, msg),
      logger: socketLogger
    })
  }

  readonly #pricesStreamSocket: WebsocketConnection

  readonly #onSocketMessage = async (ws: WebsocketConnection, message: unknown): Promise<void> => {
    if (!isBinanceSocketEvent(message)) {
      this.logger.warning('Invalid FuturesSocket message', message)
      return
    }
    if (isAssetPriceUpdateEvent(message)) {
      this.dispatchEvent(
        this.Event.ASSET_PRICE_UPDATE,
        {
          assetPair: message.s,
          price: Number(message.p)
        }
      )
    }
    else {
      this.logger.warning('Unhandled FuturesSocket event', message.e)
    }
  }

  public async start(): Promise<void> {
    this.logger.notification('Starting service...')
    return new Promise(resolve => {
      this.logger.notification('Starting socket...')
      this.#pricesStreamSocket.onConnectCallback = (): void => {
        this.subscribeToPricesStream()
        resolve()
      }
      this.#pricesStreamSocket.connect()
    })
  }

  public async stop(): Promise<void> {
    this.logger.notification('Stopping service...')
    this.#pricesStreamSocket.disconnect()
  }

  private subscribeToPricesStream(): void {
    const enabledCoins = Object.values(config.coins).filter(i => i.enabled)
    this.logger.notification(`Subscribing to prices stream for ${enabledCoins.length} coins...`)
    const request = {
      "method": "SUBSCRIBE",
      "id": this.#pricesStreamSocket.sentMessagesCount + 1,
      "params": [...enabledCoins.map(i => `${i.asset.toLowerCase()}usdt@markPrice@1s`)],
    }
    this.#pricesStreamSocket.send(request)
  }

  private logger = {
    notification(title: string, ...data: unknown[]): void {
      Logger.notification(`$ ${ServiceName}`, title, ...data)
    },
    warning(...data: unknown[]): void {
      Logger.warning('$ ${ServiceName}', ...data)
    }
  }
}

