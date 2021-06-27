import WebSocket from 'ws'
import {
  WebSocketStatus,
  WebsocketConnectionConfig,
  WebsocketOnMessageCallback,
  WebsocketOnConnectCallback
} from './types'


export default class WebsocketConnection {
  constructor(config: WebsocketConnectionConfig) {
    this.#log = config.logger || this.#log
    this.host = config.host
    this.#onConnectCallback = config.onConnectCallback || null
    this.#onMessageCallback = config.onMessageCallback
    this.reconnectOnDisconnection = config.reconnectOnDisconnection
    this.reconnectOnDisconnectionDelay = config.reconnectOnDisconnectionDelay
    this.pingServiceInterval = 4000
    this.pingServiceTimeout = 1000 * 8
    this.#socket = null
    this.#isRequestedDisconnection = false
  }

  public readonly host: string
  public readonly reconnectOnDisconnection: boolean
  public readonly reconnectOnDisconnectionDelay: number
  public readonly pingServiceInterval: number
  public readonly pingServiceTimeout: number

  #socket: WebSocket | null
  #isRequestedDisconnection: boolean
  #pingServiceTimer: NodeJS.Timeout | null = null
  #pingServiceLastPong: number = 0
  #onConnectCallback: WebsocketOnConnectCallback | null
  #onMessageCallback: WebsocketOnMessageCallback


  public get isConnected(): boolean {
    return this.#socket?.readyState === WebSocketStatus.OPEN
  }

  public get isConnecting(): boolean {
    return this.#socket?.readyState === WebSocketStatus.CONNECTING
  }

  public get isDisconnecting(): boolean {
    return this.#socket?.readyState === WebSocketStatus.CLOSING
  }

  public get isDisconnected(): boolean {
    return this.#socket?.readyState === WebSocketStatus.CLOSED
  }

  set onConnectCallback(callback: WebsocketOnConnectCallback | null) {
    this.#onConnectCallback = callback
  }

  get onConnectCallback(): WebsocketOnConnectCallback | null {
    return this.#onConnectCallback
  }

  /*----------------------------------------------------------------------------
   *
   * PUBLIC API METHODS
   *
   ---------------------------------------------------------------------------*/

  public send = (payload: Record<string, any> | any[]): void => {
    if (!this.isConnected) return
    const msg = JSON.stringify(payload)
    this.#socket!.send(msg)
  }

  public connect = (urlParams: string = ''): void => {
    if (this.isConnected || this.isConnecting) return
    this.#log(`Connecting to ${this.host} ...`)
    this.#isRequestedDisconnection = false
    this.#socket = new WebSocket(`${this.host}${urlParams ? '/' + urlParams : ''}`)
    this.#socket.on('ping', this.#onPing)
    this.#socket.on('pong', this.#onPong)
    this.#socket.on('error', this.#onSocketError)
    this.#socket.on('close', this.#onSocketDisconnect)
    this.#socket.on('open', this.#onSocketConnect)
    this.#socket.on('message', this.#onSocketMessage)
  }

  public disconnect = (): void => {
    if (this.isDisconnecting || this.isDisconnected) return
    this.#log('Disconnecting...')
    this.#isRequestedDisconnection = true
    if (this.#socket) {
      this.#socket.close()
      this.#socket = null
    }
  }

  /*----------------------------------------------------------------------------
   *
   * PING SERVICE 
   *
   ---------------------------------------------------------------------------*/
  #log = (...args: any[]): void => {
    void (args)
    // do nothing by default
  }

  #pingServiceStart = (): void => {
    // ensure Ping service is not already running by disabling it before
    // starting a new service
    this.#pingServiceStop()
    // reset las pong timestamp to current value 
    this.#pingServiceLastPong = Date.now()
    // start ping service
    this.#pingServiceTimer = setInterval(
      this.#pingServiceTick,
      this.pingServiceInterval
    )
  }

  #pingServiceStop = (): void => {
    if (!this.#pingServiceTimer) return
    clearInterval(this.#pingServiceTimer)
    this.#pingServiceTimer = null
  }

  #pingServiceTick = (): void => {
    const deltaTime = Date.now() - this.#pingServiceLastPong
    const hasTimeout = deltaTime > this.pingServiceTimeout
    if (hasTimeout) {
      this.#log('Connection Timeout')
      this.disconnect()
      this.#log(`Reconnecting in ${this.reconnectOnDisconnectionDelay}ms`)
      setTimeout(this.connect, this.reconnectOnDisconnectionDelay)
    } else {
      if (this.isConnected) this.#socket?.ping()
      else return
    }
  }


  /*----------------------------------------------------------------------------
   *
   * EVENT HANDLERS
   *
   ---------------------------------------------------------------------------*/
  #onPing = (): void => {
    this.#socket?.pong()
  }

  #onPong = (): void => {
    this.#pingServiceLastPong = Date.now()
  }

  #onSocketMessage = (msg: string): void => {
    const parsedMessage = JSON.parse(msg)
    this.#onMessageCallback(this, parsedMessage)
  }

  #onSocketError = (e: any): void => {
    this.#log(`Socket Error (${e?.code})`, e?.message)
  }

  #onSocketConnect = (): void => {
    this.#log('Connected')
    this.#pingServiceStart()
    if (this.#onConnectCallback) this.#onConnectCallback(this)
  }

  #onSocketDisconnect = (): void => {
    this.#log('Disconnected')
    this.#pingServiceStop()
    this.#socket = null
    if (
      !this.#isRequestedDisconnection &&
      this.reconnectOnDisconnection
    ) setTimeout(
      this.connect,
      this.reconnectOnDisconnectionDelay
    )
  }
}