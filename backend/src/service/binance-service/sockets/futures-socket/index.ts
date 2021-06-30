import WebsocketConnection from '@/lib/websocket'
import Logger from '@/lib/logger'
import binanceApi from '@/service/binance-service/api'
import EventedService from '@/lib/evented-service'
import { ServiceEventsDescriptor, ServiceName } from './types'
import config from '@/config'
import {
  isAccountUpdateEvent,
  isOrderTradeUpdateEvent,
  isBinanceSocketEvent,
  socketLogger,
} from './helpers'
import {
  AccountUpdateEventPositionData,
  OrderUpdateEventOrderData,
} from '@/types'

export default class FuturesSocketService extends EventedService<typeof ServiceEventsDescriptor>{
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
      // this.logger.warning('Invalid FuturesSocket message', message)
      return
    }
    else if (isAccountUpdateEvent(message)) {
      const eventData = message.a
      const positions = eventData.P
      for (const positionData of positions) this.onPositionUpdate(positionData)
    }
    else if (isOrderTradeUpdateEvent(message)) {
      const orderData: OrderUpdateEventOrderData = message.o
      this.onOrderUpdate(orderData)
    }
    else {
      // this.logger.warning('Unhandled FuturesSocket event', message.e)
    }
  }

  public async start(): Promise<void> {
    // this.logger.notification('Starting service...')
    const futuresWsKey = await this.getBinanceWebsocketDataKey()
    return new Promise(resolve => {
      // this.logger.notification('Starting socket...')
      this.#futuresSocket.onConnectCallback = (): void => {
        resolve()
      }
      this.#futuresSocket.connect(futuresWsKey)
    })
  }

  public stop(): void {
    // this.logger.notification('Stopping service...')
    this.#futuresSocket.disconnect()
  }

  private async getBinanceWebsocketDataKey(): Promise<string> {
    // this.logger.notification('Fetching UserDataKey...')
    const futuresWsKey = await binanceApi.getFuturesUserDataKey()
    return futuresWsKey
  }

  private onPositionUpdate(
    positionData: AccountUpdateEventPositionData
  ): void {
    this.dispatchEvent(
      this.Event.POSITION_UPDATE,
      {
        time: Date.now(),
        assetPair: positionData.s,
        entryPrice: Number(positionData.ep),
        quantity: Number(positionData.pa),
        unrealizedPnL: Number(positionData.up)
      }
    )
  }

  private onOrderUpdate(orderData: OrderUpdateEventOrderData): void {
    this.dispatchEvent(
      this.Event.ORDER_UPDATE,
      {
        time: orderData.T,
        assetPair: orderData.s,
        price: Number(orderData.p),
        quantity: Number(orderData.q),
        side: orderData.S,
        type: orderData.o,
        id: orderData.i,
        status: orderData.X
      }
    )
  }

  private logger = {
    notification(title: string, ...data: unknown[]): void {
      // Logger.notification(`♦︎ ${ServiceName}`, title, ...data)
    },
    warning(...data: unknown[]): void {
      // Logger.warning(`♦︎ ${ServiceName}`, ...data)
    }
  }
}
