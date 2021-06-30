import {
  AccountUpdateEvent,
  BinanceWebsocketEventType,
} from '@/types'

export function isAccountUpdateEvent(
  eventData: any
): eventData is AccountUpdateEvent {
  return eventData?.e === BinanceWebsocketEventType.ACCOUNT_UPDATE
}
