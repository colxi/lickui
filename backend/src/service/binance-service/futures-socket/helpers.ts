import Logger from '@/lib/logger'
import {
  AccountUpdateEvent,
  BinanceSocketEvent,
  BinanceWebsocketEventType,
  OrderUpdateEvent
} from '@/types'

export function isBinanceSocketEvent(event: unknown): event is BinanceSocketEvent {
  return true
    && typeof event === 'object'
    && event !== null
    && 'e' in event
    && 'E' in event
    && 'T' in event
}

export function isAccountUpdateEvent(event: BinanceSocketEvent): event is AccountUpdateEvent {
  return event.e === BinanceWebsocketEventType.ACCOUNT_UPDATE
}
export function isOrderTradeUpdateEvent(event: BinanceSocketEvent): event is OrderUpdateEvent {
  return event.e === BinanceWebsocketEventType.ORDER_TRADE_UPDATE
}

export function socketLogger(...args: any[]): void {
  const subtitle = Logger.formatText({
    reset: false,
    color: 'green',
    background: 'black',
    text: '  WS ',
  })
  Logger.notification(
    `♦︎ FUTURES SOCKET SERVICE ${subtitle}`,
    `${args[0]}`
  )
}