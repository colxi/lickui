import Logger from '@/lib/logger'
import {
  AssetPriceUpdateEvent,
  BinanceSocketEvent,
  BinanceWebsocketEventType,
} from '@/types'
import { ServiceName } from './types'

export function isBinanceSocketEvent(event: unknown): event is BinanceSocketEvent {
  return true
    && typeof event === 'object'
    && event !== null
    && 'e' in event
    && 'E' in event
}

export function isAssetPriceUpdateEvent(event: BinanceSocketEvent): event is AssetPriceUpdateEvent {
  return event.e === BinanceWebsocketEventType.ASSET_PRICE_UPDATE
}

export function socketLogger(...args: any[]): void {
  // const subtitle = Logger.formatText({
  //   reset: false,
  //   color: 'green',
  //   background: 'black',
  //   text: '  WS ',
  // })
  // Logger.notification(
  //   `$ ${ServiceName} ${subtitle}`,
  //   `${args[0]}`
  // )
}