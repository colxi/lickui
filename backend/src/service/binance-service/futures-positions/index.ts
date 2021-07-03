// import Logger from '@/lib/logger'
// import {
//     CryptoAsset,
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

//   #open: Record<CryptoAsset, FuturesPosition>
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