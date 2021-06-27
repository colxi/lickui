import { AccountUpdateEventType, AssetPair, CurrencyAmount, OrderId, OrderSide, OrderStatus, OrderType } from '@/types'

interface WalletUpdateEventData {
  totalBalance: CurrencyAmount
  availableBalance: CurrencyAmount
  type: AccountUpdateEventType
}

interface PositionUpdateEventData {
  time: number
  assetPair: AssetPair
  entryPrice: CurrencyAmount
  quantity: number
  unrealizedPnL: CurrencyAmount
}

interface OrderUpdateEventData {
  time: number
  assetPair: AssetPair
  price: CurrencyAmount
  quantity: number
  side: OrderSide
  type: OrderType
  id: OrderId
  status: OrderStatus
}

export const ServiceEventsDescriptor = {
  WALLET_UPDATE: (eventData: WalletUpdateEventData): void => { void (eventData) },
  ORDER_UPDATE: (eventData: OrderUpdateEventData): void => { void (eventData) },
  POSITION_UPDATE: (eventData: PositionUpdateEventData): void => { void (eventData) }
}
