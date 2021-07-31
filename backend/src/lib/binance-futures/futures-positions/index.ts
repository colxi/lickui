/// old implementation :

import EventedService from '@/lib/evented-service'
import Logger from '@/lib/logger'
import { AssetName, BinancePositionSide } from '@/types'
import FuturesApiService from '../futures-api'
import { BinanceFuturesAPIOrder, BinanceFuturesAPIPosition } from '../futures-api/types'
import { LoggerConfigs } from '../logger.config'
import FuturesPositionsSocketManager from './socket-manager'
import { FuturesPositionsServiceConfig, FuturesPositionsServiceEvents, FuturesPositionsServiceFetchOrderByClientOrderIdOptions, FuturesPositionsServiceOpenPositionOptions } from './types'


class FuturesPosition {
  constructor(options: { assetName: AssetName, position: BinanceFuturesAPIPosition, order: BinanceFuturesAPIOrder | null }) {
    this.#position = options.position
    this.#order = options.order
  }

  #position: BinanceFuturesAPIPosition
  #order: BinanceFuturesAPIOrder | null
}

export default class FuturesPositionsService extends EventedService<FuturesPositionsServiceConfig>{
  constructor(options: { api: FuturesApiService, logger: Logger }) {
    super({
      verbose: false,
      logger: ((): (...args: any[]) => void => {
        const logger = options.logger.createChild(LoggerConfigs.serviceEvent)
        return (message: string, ...args: any[]): void => logger.log(message, ...args)
      })(),
      events: typeof FuturesPositionsServiceEvents,
      onStart: async () => {
        await this.#initPositions()
        const userDataKey = await this.#api.getFuturesUserDataKey()
        await this.#socketManager.connect(userDataKey)
      },
      onStop: async () => {
        await this.#socketManager.disconnect()
      }
    })

    this.#api = options.api
    this.#positions = {}
    this.#socketManager = new FuturesPositionsSocketManager({
      logger: options.logger,
      onPositionUpdate: (): void => { this.#updatePosition({}) }
    })
  }

  readonly #api: FuturesApiService
  readonly #positions: Record<AssetName, FuturesPosition>
  readonly #socketManager: FuturesPositionsSocketManager

  #updatePosition = (a: any) => {
    //
  }

  #initPositions = async (): Promise<void> => {
    const openPositions = await this.#api.getFuturesOpenPosition()
    const openOrders = await this.#api.getFutureOpenOrders()
    for (const position of openPositions) {
      const assetName: AssetName = position.symbol
      const order = openOrders.find(o => o.symbol === assetName) || null
      this.#positions[position.symbol] = new FuturesPosition({
        assetName: assetName,
        position: position,
        order: order,
      })
      console.log('Position :', position.symbol)
      console.log('Side :', Number(position.notional) > 0 ? BinancePositionSide.LONG : BinancePositionSide.SHORT)
      console.log('Margin :', position.initialMargin, 'USDT')
      console.log('Amount :', position.positionAmt, position.symbol.slice(0, -4))
      console.log('Leverage :', position.leverage)
      console.log('UPnL :', position.unrealizedProfit, 'USDT')
      console.log('Entry Price :', position.entryPrice, 'USDT')
      console.log('-- LIMIT order ID:', order?.orderId)
      console.log('-- LIMIT order SIDE:', order?.side)
      console.log('-- LIMIT order price:', order?.price)
      console.log('-- LIMIT order quantity:', order?.origQty)
      console.log('----------')
    }

  }

  /**
   * 
   * 
   */
  public async openPosition(
    options: FuturesPositionsServiceOpenPositionOptions
  ): Promise<BinanceFuturesAPIOrder> {
    const marketOrder = await this.#api.createFuturesMarketOrder({
      assetName: options.assetName,
      side: options.side,
      quantity: options.quantity,
    })
    return marketOrder
  }


  /**
   * 
   * 
   */
  public async fetchOrderByClientOrderId(
    options: FuturesPositionsServiceFetchOrderByClientOrderIdOptions
  ): Promise<BinanceFuturesAPIOrder> {
    const order = await this.#api.getFuturesOrderByClientId({
      assetName: options.assetName,
      clientOrderId: options.clientOrderId,
    })
    return order
  }
}


//   readonly #onSocketMessage = async (ws: WebsocketConnection, message: unknown): Promise<void> => {
//      if (isAccountUpdateEvent(message)) {
//       const eventData = message.a
//       const positions = eventData.P
//       for (const positionData of positions) this.onPositionUpdate(positionData)
//     }
//     else if (isOrderTradeUpdateEvent(message)) {
//       const orderData: OrderUpdateEventOrderData = message.o
//       this.onOrderUpdate(orderData)
//     }
//    
//   }

//   private onPositionUpdate(
//     positionData: AccountUpdateEventPositionData
//   ): void {
//     this.dispatchEvent(
//       this.Event.POSITION_UPDATE,
//       {
//         time: Date.now(),
//         assetPair: positionData.s,
//         entryPrice: Number(positionData.ep),
//         quantity: Number(positionData.pa),
//         unrealizedPnL: Number(positionData.up)
//       }
//     )
//   }

//   private onOrderUpdate(orderData: OrderUpdateEventOrderData): void {
//     this.dispatchEvent(
//       this.Event.ORDER_UPDATE,
//       {
//         time: orderData.T,
//         assetPair: orderData.s,
//         price: Number(orderData.p),
//         quantity: Number(orderData.q),
//         side: orderData.S,
//         type: orderData.o,
//         id: orderData.i,
//         status: orderData.X
//       }
//     )
//   }


//////////////////////////////////////////////////////////////////////////////////////////
// NEW IMPLEMENTATION

// import Logger from '@/lib/logger'
// import {
//     AssetName,
//     Immutable,
//     FuturesPositionDescriptor,
//     FuturesOrderDescriptor,
//     OrderType,
//     OrderStatus
// } from '@/types'
// import FuturesPosition from './position'


// // Fetch & Set positions
// const futuresOpenPositions = await DataProvider.getFuturesOpenPositions()
// for (const position of Object.values(futuresOpenPositions)) {
//   this.#positions.updatePosition(position)
// }

// // fetch position order history
// for (const position of Object.values(futuresOpenPositions)) {
//   const lasWeekOrders = await binanceApi.getLastWeekFutureOrders(position.assetPair)
//   const positionOrders: BinanceFuturesAPIOrder[] = []
//   for (let i = lasWeekOrders.length - 1; i >= 0; i--) {
//     const order = lasWeekOrders[i]
//     if (order.type === OrderType.LIMIT && order.status === OrderStatus.FILLED) break
//     positionOrders.push(order)
//   }
//   positionOrders.reverse()
//   for (const order of positionOrders) {
//     if (order.type === OrderType.LIMIT && order.status === OrderStatus.CANCELED) {
//       this.#positions.updatePositionOrder({
//         time: order.time,
//         assetPair: order.symbol,
//         price: Number(order.price),
//         quantity: Number(order.origQty),
//         side: order.side,
//         type: order.type,
//         id: order.orderId,
//         status: OrderStatus.NEW
//       })
//       this.#positions.updatePositionOrder({
//         time: order.updateTime,
//         assetPair: order.symbol,
//         price: Number(order.price),
//         quantity: Number(order.origQty),
//         side: order.side,
//         type: order.type,
//         id: order.orderId,
//         status: OrderStatus.CANCELED
//       })
//     } else {
//       this.#positions.updatePositionOrder({
//         time: order.time,
//         assetPair: order.symbol,
//         price: Number(order.price),
//         quantity: Number(order.origQty),
//         side: order.side,
//         type: order.type,
//         id: order.orderId,
//         status: order.status
//       })
//     }
//   }
// }


// export class FuturesPositionsManager {
//   constructor() {
//     this.#open = {}
//     this.#history = []
//   }

//   #open: Record<AssetName, FuturesPosition>
//   #history: Array<FuturesPosition>

//   public get open(): Immutable<Record<string, unknown>> {
//     const positions: Record<string, unknown> = {}
//     for (const position of Object.values(this.#open)) {
//       const positionData = position.toJSON()
//       positions[positionData.assetPair] = positionData
//     }
//     return positions
//   }

//   public updatePosition(position: FuturesPositionDescriptor): void {
//     Logger.event('WS-POSITION-UPDATE', position.assetPair)
//     console.log(position)
//     if (position.assetPair in this.#open) {
//       this.#open[position.assetPair].updatePosition(position)
//     } else {
//       this.#open[position.assetPair] = new FuturesPosition(position)
//     }

//     //   if (position.amount === 0) action = 'DELETE'
//     //   else action = assetPair in this.#futuresPositions ? 'UPDATE' : 'CREATE'
//     //   console.log(` - ${action} POSITION`, JSON.stringify(position))

//     //   if (action === 'DELETE') delete this.#futuresPositions[assetPair]
//     //   else this.#futuresPositions[assetPair] = { ...position }
//   }

//   public updatePositionOrder(order: FuturesOrderDescriptor): void {
//     if (order.assetPair in this.#open) {
//       Logger.event('WS-ORDER-UPDATE', order.assetPair)
//       console.log(order)
//       this.#open[order.assetPair].updatePositionOrder(order)
//       // if order is closed remove it from open and add it to closed
//       const isLimitFilled = order.type === OrderType.LIMIT && order.status === OrderStatus.FILLED
//       if (isLimitFilled) {
//         this.#history.push(this.#open[order.assetPair])
//         delete this.#open[order.assetPair]
//       }

//     }
//   }
// }

// export default new FuturesPositionsManager()

// DATA PORVIDERSSS!!!!

// import binanceApi from '@/core/binance-api'
// import { BinanceBalanceData, BinanceClientOrderMap, BinanceClientPositionMap } from '@/types'


// export default class DataProvider {

//   static async getFuturesOpenPositions(): Promise<BinanceClientPositionMap> {
//     console.log('Fetching futures positions...')
//     const futuresOpenPositionsRaw = await binanceApi.getFuturesOpenPosition()
//     const futuresOpenPositions: BinanceClientPositionMap = {}
//     for (const position of futuresOpenPositionsRaw) {
//       console.log(` - POSITION: assetPair:${position.symbol} entryPrice:${position.entryPrice} amount:${position.positionAmt}`)
//       futuresOpenPositions[position.symbol] = {
//         time: Date.now(),
//         assetPair: position.symbol,
//         entryPrice: Number(position.entryPrice),
//         quantity: Number(position.positionAmt),
//         unrealizedPnL: Number(position.unrealizedProfit),
//       }
//     }
//     return futuresOpenPositions
//   }


//   static async getFuturesOrders(): Promise<BinanceClientOrderMap> {
//     console.log('Fetching open futures orders...')
//     const futureOrdersRaw = await binanceApi.getOpenFutureOrders()
//     const futureOrders: BinanceClientOrderMap = {}
//     for (const order of futureOrdersRaw) {
//       console.log(` - ORDER: assetPair:${order.symbol} price:${order.price} origQty:${order.origQty} side:${order.side} type:${order.type} [id:${order.orderId}]`)
//       futureOrders[order.orderId] = {
//         time: order.time,
//         assetPair: order.symbol,
//         price: Number(order.price),
//         quantity: Number(order.origQty),
//         side: order.side,
//         type: order.type,
//         id: order.orderId,
//         status: order.status
//       }
//     }
//     return futureOrders
//   }

// }