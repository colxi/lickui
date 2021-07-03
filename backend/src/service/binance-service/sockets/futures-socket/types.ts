import { AccountUpdateEventType, CryptoAsset, CurrencyAmount, OrderId, OrderSide, OrderStatus, OrderType, Timestamp } from '@/types'

interface WalletUpdateEventData {
  totalBalance: CurrencyAmount
  availableBalance: CurrencyAmount
  type: AccountUpdateEventType
}

interface PositionUpdateEventData {
  time: Timestamp
  assetPair: CryptoAsset
  entryPrice: CurrencyAmount
  quantity: number
  unrealizedPnL: CurrencyAmount
}

interface OrderUpdateEventData {
  time: Timestamp
  assetPair: CryptoAsset
  price: CurrencyAmount
  quantity: number
  side: OrderSide
  type: OrderType
  id: OrderId
  status: OrderStatus
}


export const ServiceName = 'FuturesSocketService'

export const ServiceEventsDescriptor = {
  ORDER_UPDATE: (eventData: OrderUpdateEventData): void => { void (eventData) },
  POSITION_UPDATE: (eventData: PositionUpdateEventData): void => { void (eventData) },
}
