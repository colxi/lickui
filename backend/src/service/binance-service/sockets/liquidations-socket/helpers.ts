import Logger from '@/lib/logger'
import {
  AccountUpdateEvent,
  BinanceSocketEvent,
  BinanceWebsocketEventType,
  LiquidationsEvent,
  OrderUpdateEvent
} from '@/types'
import { ServiceName } from './types'

export function isBinanceSocketEvent(eventData: unknown): eventData is BinanceSocketEvent {
  return true
    && typeof eventData === 'object'
    && eventData !== null
    && 'e' in eventData
    && 'E' in eventData
}

export function isAccountUpdateEvent(
  eventData: BinanceSocketEvent
): eventData is AccountUpdateEvent {
  return eventData.e === BinanceWebsocketEventType.ACCOUNT_UPDATE
}

export function isOrderTradeUpdateEvent(
  eventData: BinanceSocketEvent
): eventData is OrderUpdateEvent {
  return eventData.e === BinanceWebsocketEventType.ORDER_TRADE_UPDATE
}

export function isLiquidationsUpdateEvent(
  eventData: BinanceSocketEvent
): eventData is LiquidationsEvent {
  return eventData.e === BinanceWebsocketEventType.LIQUIDATIONS_UPDATE
}

export function socketLogger(...args: any[]): void {
  // const subtitle = Logger.formatText({
  //   reset: false,
  //   color: 'green',
  //   background: 'black',
  //   text: '  WS ',
  // })
  // Logger.notification(
  //   `✖︎ ${ServiceName} ${subtitle}`,
  //   `${args[0]}`
  // )
}