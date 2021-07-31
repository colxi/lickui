import { BinanceWebsocketEventType } from '../../types'
import { BinanceWebsocketAssetCandleUpdateEvent } from './types'


export function isAssetCandleUpdateEvent(
  eventData: any
): eventData is BinanceWebsocketAssetCandleUpdateEvent {
  return eventData?.e === BinanceWebsocketEventType.ASSET_CANDLE_UPDATE
}
