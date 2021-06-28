import { AccountUpdateEventType, AssetPair, CurrencyAmount, OrderId, OrderSide, OrderStatus, OrderType, Timestamp } from '@/types'

interface WalletUpdateEventData {
  totalBalance: CurrencyAmount
  availableBalance: CurrencyAmount
  type: AccountUpdateEventType
}

interface PositionUpdateEventData {
  time: Timestamp
  assetPair: AssetPair
  entryPrice: CurrencyAmount
  quantity: number
  unrealizedPnL: CurrencyAmount
}

interface OrderUpdateEventData {
  time: Timestamp
  assetPair: AssetPair
  price: CurrencyAmount
  quantity: number
  side: OrderSide
  type: OrderType
  id: OrderId
  status: OrderStatus
}

interface LiquidationsUpdateEventData {
  assetPair: AssetPair
  price: CurrencyAmount
  total: CurrencyAmount
  quantity: number
  side: OrderSide
}

export const ServiceName = 'FuturesSocketService'

export const ServiceEventsDescriptor = {
  WALLET_UPDATE: (eventData: WalletUpdateEventData): void => { void (eventData) },
  ORDER_UPDATE: (eventData: OrderUpdateEventData): void => { void (eventData) },
  POSITION_UPDATE: (eventData: PositionUpdateEventData): void => { void (eventData) },
  LIQUIDATIONS_UPDATE: (eventData: LiquidationsUpdateEventData): void => { void (eventData) }
}
