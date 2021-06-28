import { Immutable } from '@/types'
import Logger from '@/lib/logger'

type EventsDictionary = Record<string, (a: any) => void>

interface EventedServiceOptions {
  events: EventsDictionary
  serviceName: string
  verbose?: boolean
}

export default class EventedService<E_DICTIONARY extends EventsDictionary> {
  constructor(
    options: EventedServiceOptions
  ) {
    this.serviceName = options.serviceName
    this.verbose = options.verbose || false

    this.#subscribers = Object.keys(options.events).reduce((acc, eventName) => {
      acc[eventName] = new Set()
      return acc
    }, {} as any)

    this.Event = Object.keys(options.events).reduce((acc, eventName) => {
      acc[eventName] = eventName
      return acc
    }, {} as any)
  }

  readonly serviceName: string

  readonly verbose: boolean

  readonly #subscribers: Record<
    keyof E_DICTIONARY,
    Set<E_DICTIONARY[keyof E_DICTIONARY]>
  >

  readonly Event: Immutable<
    { [K in keyof E_DICTIONARY]: Extract<keyof E_DICTIONARY, K> }
  >

  protected dispatchEvent<E_NAME extends keyof E_DICTIONARY>(
    eventName: E_NAME,
    eventData: Parameters<E_DICTIONARY[E_NAME]>[0]
  ): void {
    if (this.verbose) Logger.event(this.serviceName, `${eventName}`)
    for (const eventHandler of this.#subscribers[eventName]) {
      eventHandler(eventData)
    }
  }

  public subscribe<
    E_NAME extends keyof E_DICTIONARY,
    E_HANDLER extends E_DICTIONARY[E_NAME]
  >(
    eventName: E_NAME,
    eventHandler: E_HANDLER
  ): void {
    this.#subscribers[eventName].add(eventHandler)
  }


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

