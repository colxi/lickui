import Logger from '@/lib/logger'
import EventedService from '@/lib/evented-service'
import { LoggerConfigs } from '../logger.config'
import FuturesAssetsSocketManager from './socket-manager'
import List from '@/lib/list'
import {
  FuturesLiquidationsServiceConfig,
  FuturesLiquidationsServiceEvents,
  FuturesLiquidationsServiceOptions,
  LiquidationEvent
} from './types'
import { clearObject } from '@/lib/object'
import { Immutable } from '@/types'
import { AssetName } from '../types'

const LIQUIDATIONS_HISTORY_MAX_LENGTH = 5

/**
* 
* 
* 
*/
export default class FuturesLiquidationsService extends EventedService<FuturesLiquidationsServiceConfig>{
  constructor(options: FuturesLiquidationsServiceOptions) {
    super({
      verbose: false,
      events: FuturesLiquidationsServiceEvents,
      logger: ((): (...args: any[]) => void => {
        const logger = options.logger.createChild(LoggerConfigs.serviceEvent)
        return (message: string, ...args: any[]): void => logger.log(message, ...args)
      })(),
      onStart: async ({ assets }) => {
        await this.#initAssets(assets)
        await this.#socketManager.connect({ assets })
      },
      onStop: async () => {
        await this.#socketManager.disconnect()
      }
    })

    this.#logger = options.logger
    this.#asset = {}
    this.#socketManager = new FuturesAssetsSocketManager({
      logger: this.#logger.createChild(LoggerConfigs.futuresLiquidationsServiceSocketManager),
      onLiquidationUpdate: (event: LiquidationEvent): void => {
        this.#asset[event.assetName].add(event)
        this.dispatchEvent(this.Event.LIQUIDATION_EVENT, event)
      }
    })
  }


  readonly #logger: Logger
  readonly #asset: Record<AssetName, List<LiquidationEvent>>
  readonly #socketManager: FuturesAssetsSocketManager

  public get assets(): Immutable<Record<AssetName, List<LiquidationEvent>>> { return this.#asset }
  public get isSocketConnected(): boolean { return this.#socketManager.isConnected }


  /***
   * 
   * Initialize the list of provided assets
   * 
   */
  #initAssets = async (
    assets: AssetName[]
  ): Promise<void> => {
    clearObject(this.#asset)
    for (const assetName of assets) {
      this.#asset[assetName] = new List<LiquidationEvent>(LIQUIDATIONS_HISTORY_MAX_LENGTH)
    }
  }
}
