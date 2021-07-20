// import {
//   AssetName,
//   FuturesOrderDescriptor,
//   FuturesPositionDescriptor,
//   OrderStatus,
//   OrderType,
//   Timestamp
// } from '@/types'

// export default class FuturesPosition {
//   constructor(position: FuturesPositionDescriptor) {
//     this.#assetPair = position.assetPair
//     this.#entryPrice = position.entryPrice
//     this.#unrealizedPnL = position.unrealizedPnL
//     this.#quantity = position.quantity
//     this.#initialQuantity = position.quantity
//     this.#order = null
//     this.#time = position.time
//     this.#history = []
//   }

//   #history: any[]
//   #assetPair: AssetName
//   #entryPrice: number
//   #initialQuantity: number
//   #quantity: number
//   #unrealizedPnL: number
//   #order: FuturesOrderDescriptor | null
//   #time: Timestamp

//   updatePositionOrder(order: FuturesOrderDescriptor): void {
//     const isMarketNewOrder = order.type === OrderType.MARKET && order.status === OrderStatus.NEW
//     const isMarketPartiallyFilled = order.type === OrderType.MARKET && order.status === OrderStatus.PARTIALLY_FILLED
//     // to prevent unnecessary noise, don't add marketNew Orders as they are 
//     // always followed by a FILL order. Same applies to market partially filled.
//     if (!isMarketNewOrder && !isMarketPartiallyFilled) this.#history.push(order)
//     this.#order = order
//   }

//   updatePosition(position: FuturesPositionDescriptor): void {
//     // this.#history.push(position)
//     this.#assetPair = position.assetPair
//     this.#entryPrice = position.entryPrice
//     this.#quantity = (position.quantity === 0) ? this.#quantity : position.quantity
//     this.#unrealizedPnL = position.unrealizedPnL

//   }

//   toJSON() {
//     return {
//       time: this.#time,
//       assetPair: this.#assetPair,
//       entryPrice: this.#entryPrice,
//       quantity: this.#quantity,
//       initialQuantity: this.#initialQuantity,
//       unrealizedPnL: this.#unrealizedPnL,
//       order: this.#order,
//       history: this.#history
//     }
//   }
// }