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
  onConnectCallback: WebsocketOnConnectCallback
  logger?: (...args: unknown[]) => void
}


export enum WebSocketStatus {
  OPEN = WebSocket.OPEN,
  CONNECTING = WebSocket.CONNECTING,
  CLOSING = WebSocket.CLOSING,
  CLOSED = WebSocket.CLOSED,
}
