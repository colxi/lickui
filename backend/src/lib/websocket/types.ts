import webSocket from 'ws'
import WebsocketConnection from "./index"


export type WebsocketOnMessageCallbackMessage = Record<string, any> | any[]

export type WebsocketOnMessageCallback = (
  context: WebsocketConnection,
  message: WebsocketOnMessageCallbackMessage
) => unknown

export type WebsocketOnConnectCallback = (
  context: WebsocketConnection
) => void

export interface WebsocketConnectionConfig {
  host: string
  reconnectOnDisconnection: boolean
  reconnectOnDisconnectionDelay: number
  onMessageCallback: WebsocketOnMessageCallback
  onConnectCallback?: WebsocketOnConnectCallback | null
  logger?: (...args: unknown[]) => void
}


export enum WebSocketStatus {
  OPEN = webSocket.OPEN,
  CONNECTING = webSocket.CONNECTING,
  CLOSING = webSocket.CLOSING,
  CLOSED = webSocket.CLOSED,
}
