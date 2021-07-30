import { BinanceWebsocketEventType, } from '@/types'
import { BinanceWebsocketAccountUpdateEvent, BinanceWebsocketOrderUpdateEvent } from './types'

export function isAccountUpdateEvent(
  eventData: any
): eventData is BinanceWebsocketAccountUpdateEvent {
  return eventData?.e === BinanceWebsocketEventType.ACCOUNT_UPDATE
}

export function isOrderUpdateEvent(
  eventData: any
): eventData is BinanceWebsocketOrderUpdateEvent {
  return eventData?.e === BinanceWebsocketEventType.ORDER_TRADE_UPDATE
}
