
import { BinanceWebsocketAccountUpdateEvent } from '../../futures-positions/socket-manager/types'
import { BinanceWebsocketEventType } from '../../types'

export function isAccountUpdateEvent(
  eventData: any
): eventData is BinanceWebsocketAccountUpdateEvent {
  return eventData?.e === BinanceWebsocketEventType.ACCOUNT_UPDATE
}
