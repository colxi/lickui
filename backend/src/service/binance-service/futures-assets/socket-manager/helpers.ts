import {
  AssetPriceUpdateEvent,
  BinanceWebsocketEventType,
} from '@/types'


export function isAssetUpdateEvent(
  eventData: any
): eventData is AssetPriceUpdateEvent {
  return eventData?.e === BinanceWebsocketEventType.ASSET_PRICE_UPDATE
}
