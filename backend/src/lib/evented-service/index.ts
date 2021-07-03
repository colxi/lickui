import { Immutable, PlainObject } from '@/types'
import {
  EventedServiceOptions,
  EventsDictionary,
  ServiceStatus
} from './types'

const EventedServiceNativeEvents = {
  SERVICE_STARTING: (eventData: undefined): void => { void (eventData) },
  SERVICE_STARTED: (eventData: undefined): void => { void (eventData) },
  SERVICE_STOPPING: (eventData: undefined): void => { void (eventData) },
  SERVICE_STOPPED: (eventData: undefined): void => { void (eventData) },
}

/**
 * EventedService is a basic Service Class with start/stop features and Event
 * emission mechanisms  
 */
export default abstract class EventedService<
  T extends EventedServiceOptions,
  E_DICTIONARY extends EventsDictionary = T['events'] & typeof EventedServiceNativeEvents,
  START_METHOD_PARAMS extends any[] = T['onStart'] extends (...a: any) => any
  /**/ ? Parameters<T['onStart']>
  /**/ : never[],
  STOP_METHOD_PARAMS extends any[] = T['onStop'] extends (...a: any) => any
  /**/ ? Parameters<T['onStop']>
  /**/ : never[]
  > {
  constructor(options: T) {
    this.#log = options.logger || console.log
    this.#verbose = options.verbose || false
    this.#serviceStatus = ServiceStatus.STOPPED
    this.#onStart = options.onStart || function (): void { return }
    this.#onStop = options.onStop || function (): void { return }
    const events = { ...EventedServiceNativeEvents, ...options.events }
    this.#subscribers = Object.keys(events).reduce((acc, eventName) => {
      acc[eventName] = new Set()
      return acc
    }, {} as any)
    this.Event = Object.keys(events).reduce((acc, eventName) => {
      acc[eventName] = eventName
      return acc
    }, {} as any)
  }

  #serviceStatus: ServiceStatus
  #verbose: boolean

  readonly #log: (...args: any) => void
  readonly #subscribers: Record<keyof E_DICTIONARY, Set<E_DICTIONARY[keyof E_DICTIONARY]>>

  readonly #onStart: (...args: START_METHOD_PARAMS) => Promise<void>
  readonly #onStop: (...args: STOP_METHOD_PARAMS) => Promise<void>

  public Event: Immutable<{ [K in keyof E_DICTIONARY]: Extract<keyof E_DICTIONARY, K> }>
  public get serviceStatus(): ServiceStatus { return this.#serviceStatus }


  /**
   * 
   * 
   */
  public async start(...args: START_METHOD_PARAMS): Promise<void> {
    if (this.#serviceStatus === ServiceStatus.RUNNING) return
    this.dispatchEvent('SERVICE_STARTING', undefined, true)
    await this.#onStart(...args)
    this.#serviceStatus = ServiceStatus.RUNNING
    this.dispatchEvent('SERVICE_STARTED', undefined, true)
  }

  /**
   * 
   * 
   */
  public async stop(...args: STOP_METHOD_PARAMS): Promise<void> {
    if (this.#serviceStatus === ServiceStatus.STOPPED) return
    this.dispatchEvent('SERVICE_STARTED', undefined, true)
    await this.#onStop(...args)
    this.#serviceStatus = ServiceStatus.STOPPED
    this.dispatchEvent('SERVICE_STOPPED', undefined, true)

  }

  /**
   * 
   * 
   */
  // Parameters<E_DICTIONARY[E_NAME]>[0] extends never ? never : Parameters<E_DICTIONARY[E_NAME]>[0]
  protected dispatchEvent<E_NAME extends keyof E_DICTIONARY>(
    eventName: E_NAME,
    eventData: Parameters<E_DICTIONARY[E_NAME]>[0],
    forceLog: boolean = false
  ): void {
    // const [eventName, eventData] = args
    if (this.#verbose || forceLog) this.#log(`${eventName}`)
    for (const eventHandler of this.#subscribers[eventName]) {
      eventHandler(eventData)
    }
  }

  /**
   * 
   * 
   */
  public subscribe<
    E_NAME extends keyof E_DICTIONARY,
    E_HANDLER extends E_DICTIONARY[E_NAME]
  >(
    eventName: E_NAME,
    eventHandler: E_HANDLER
  ): void {
    this.#subscribers[eventName].add(eventHandler)
  }

  /**
   * 
   * 
   */
  public unsubscribe<
    E_NAME extends keyof E_DICTIONARY,
    E_HANDLER extends E_DICTIONARY[E_NAME]
  >(
    eventName: E_NAME,
    eventHandler: E_HANDLER
  ): void {
    this.#subscribers[eventName].delete(eventHandler)
  }
}

