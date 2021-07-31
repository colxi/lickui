export type EventsDictionary = Record<string, (a: any) => void | Promise<void>>

export enum ServiceStatus {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED'
}

export interface EventedServiceOptions {
  events: EventsDictionary
  logger?: (...args: any) => void
  verbose?: boolean
  onStart?: (...a: any) => any
  onStop?: (...a: any) => any
}
