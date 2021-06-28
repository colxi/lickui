import { AssetPair, CurrencyAmount } from '@/types'

interface AssetPriceUpdateEventData {
  assetPair: AssetPair
  price: CurrencyAmount
}

export const ServiceName = 'PricesSocketService'

export const ServiceEventsDescriptor = {
  ASSET_PRICE_UPDATE: (eventData: AssetPriceUpdateEventData): void => { void (eventData) },
}
