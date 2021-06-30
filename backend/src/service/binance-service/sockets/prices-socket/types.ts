import { AssetPair, CurrencyAmount, Timestamp } from '@/types'

export interface AssetPriceUpdateEventData {
  timestamp: Timestamp
  assetPair: AssetPair
  price: CurrencyAmount
}

export const ServiceName = 'PricesSocketService'

export const ServiceEventsDescriptor = {
  ASSET_PRICE_UPDATE: (eventData: AssetPriceUpdateEventData): void => { void (eventData) },
}
