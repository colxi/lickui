import { AssetPair, CurrencyAmount, OrderSide } from '@/types'

interface LiquidationsUpdateEventData {
  assetPair: AssetPair
  price: CurrencyAmount
  total: CurrencyAmount
  quantity: number
  side: OrderSide
}

export const ServiceName = 'LiquidationsSocketService'

export const ServiceEventsDescriptor = {
  LIQUIDATIONS_UPDATE: (eventData: LiquidationsUpdateEventData): void => { void (eventData) }
}
