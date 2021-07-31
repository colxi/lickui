import { AssetName, ClientOrderId, CurrencyAmount, OrderSide } from '../../types'

export const FuturesPositionsServiceEvents = {
  //
}

export interface FuturesPositionsServiceConfig {
  verbose: boolean
  logger: (...args: any) => void
  events: typeof FuturesPositionsServiceEvents
  onStart: () => Promise<void>
  onStop: () => Promise<void>
}


export interface FuturesPositionsServiceOpenPositionOptions {
  assetName: AssetName
  quantity: CurrencyAmount
  side: OrderSide
}

export interface FuturesPositionsServiceFetchOrderByClientOrderIdOptions {
  assetName: AssetName
  clientOrderId: ClientOrderId
}
