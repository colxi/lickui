import WebsocketConnection from '@/lib/websocket'
import Logger from '@/lib/logger'
import {
  isAccountUpdateEvent,
  isOrderTradeUpdateEvent,
  isBinanceSocketEvent,
  socketLogger
} from './helpers'
import {
  AccountUpdateEventWalletData,
  AccountUpdateEventPositionData,
  OrderUpdateEventOrderData,
  AccountUpdateEventType,
} from '@/types'
import binanceApi from '@/api/binance'
import EventedService from '@/lib/evented-service'
import { ServiceEventsDescriptor } from './types'
import config from '@/config'


export default class FuturesSocketService extends EventedService<typeof ServiceEventsDescriptor>{
  constructor() {
    super(ServiceEventsDescriptor)

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
      this.logger.warning('Invalid FuturesSocket message', message)
      return
    }
    else if (isAccountUpdateEvent(message)) {
      const eventData = message.a
      const eventType = eventData.m
      const positions = eventData.P
      const walletData = eventData.B.find((i: AccountUpdateEventWalletData) => i.a === 'USDT')
      for (const positionData of positions) this.onPositionUpdate(positionData)
      if (walletData) this.onWalletUpdate(walletData, eventType)
    }
    else if (isOrderTradeUpdateEvent(message)) {
      const orderData: OrderUpdateEventOrderData = message.o
      this.onOrderUpdate(orderData)
    }
    else {
      this.logger.warning('Unhandled FuturesSocket event', message.e)
    }
  }

  public async start(): Promise<void> {
    this.logger.notification('Starting service...')
    const futuresWsKey = await this.getBinanceWebsocketDataKey()
    return new Promise(resolve => {
      this.logger.notification('Starting socket...')
      this.#futuresSocket.onConnectCallback = (): void => resolve()
      this.#futuresSocket.connect(futuresWsKey)
    })
  }

  public stop(): void {
    this.logger.notification('Stopping service...')
    this.#futuresSocket.disconnect()
  }

  private async getBinanceWebsocketDataKey(): Promise<string> {
    this.logger.notification('Fetching UserDataKey...')
    const futuresWsKey = await binanceApi.getFuturesUserDataKey()
    return futuresWsKey
  }

  private onWalletUpdate(
    walletData: AccountUpdateEventWalletData,
    type: AccountUpdateEventType
  ): void {
    const totalBalance = Number(walletData.wb)
    const availableBalance = Number(walletData.cw)
    this.dispatchEvent(
      this.Event.WALLET_UPDATE,
      { totalBalance, availableBalance, type }
    )
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
    console.log(positionData)

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
    console.log(orderData)

  }


  private logger = {
    notification(title: string, ...data: unknown[]): void {
      Logger.notification('♦︎ FUTURES SOCKET SERVICE', title, ...data)
    },
    warning(...data: unknown[]): void {
      Logger.warning('♦︎ FUTURES SOCKET SERVICE', ...data)
    }
  }
}

