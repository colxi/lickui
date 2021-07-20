import { BinanceWebsocketEventType, } from '@/types'
import { BinanceWebsocketLiquidationEvent } from './types'


export function isLiquidationsUpdateEvent(
  eventData: any
): eventData is BinanceWebsocketLiquidationEvent {
  return eventData.e === BinanceWebsocketEventType.LIQUIDATIONS_UPDATE
}
