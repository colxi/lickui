import FuturesPositionsService from './futures-positions'
import FuturesWalletService from './futures-wallet'
import FuturesAssetsService from './futures-assets'
import FuturesApiService from './futures-api'
import Logger from '@/lib/logger'
import { LoggerConfigs } from './helpers'
import { AssetName, Timestamp } from '@/types'
import FuturesLiquidationsService from './futures-liquidations'
import { ServiceStatus } from '@/lib/evented-service/types'
import { BinanceServiceStartOptions, BinanceServiceStatus } from './types'
import { clearArray } from '@/lib/array'


class BinanceService {
  constructor() {
    const binanceLogger = new Logger(LoggerConfigs.binanceClient)
    const futuresApiServiceLogger = binanceLogger.createChild(LoggerConfigs.futuresApiService)
    const futuresWalletServiceLogger = binanceLogger.createChild(LoggerConfigs.futuresWalletService)
    const futuresAssetServiceLogger = binanceLogger.createChild(LoggerConfigs.futuresAssetService)
    const futuresLiquidationServiceLogger = binanceLogger.createChild(LoggerConfigs.futuresLiquidationsService)
    const futuresPositionsServiceLogger = binanceLogger.createChild(LoggerConfigs.futuresPositionsService)

    this.#assetPairs = []
    this.#startTime = 0
    this.#isBusy = false
    this.#logger = binanceLogger
    this.#api = new FuturesApiService({ logger: futuresApiServiceLogger })
    this.liquidations = new FuturesLiquidationsService({ logger: futuresLiquidationServiceLogger })
    this.wallet = new FuturesWalletService({ api: this.#api, logger: futuresWalletServiceLogger })
    this.assets = new FuturesAssetsService({ api: this.#api, logger: futuresAssetServiceLogger })
    this.positions = new FuturesPositionsService({ api: this.#api, logger: futuresPositionsServiceLogger })
  }

  #isBusy: boolean
  #startTime: Timestamp

  readonly #logger: Logger
  readonly #api: FuturesApiService
  readonly #assetPairs: AssetName[]

  public readonly wallet: FuturesWalletService
  public readonly assets: FuturesAssetsService
  public readonly liquidations: FuturesLiquidationsService
  public readonly positions: FuturesPositionsService

  get startTime(): Timestamp { return this.#startTime }

  get status(): BinanceServiceStatus {
    const isActive = (
      this.assets.serviceStatus === ServiceStatus.RUNNING &&
      this.liquidations.serviceStatus === ServiceStatus.RUNNING &&
      this.wallet.serviceStatus === ServiceStatus.RUNNING
    )
    return {
      isActive: isActive,
      isBusy: this.#isBusy,
      services: {
        wallet: {
          status: this.wallet.serviceStatus,
          isSocketConnected: this.wallet.isSocketConnected,
        },
        liquidations: {
          status: this.liquidations.serviceStatus,
          isSocketConnected: this.liquidations.isSocketConnected,
        },
        assets: {
          status: this.assets.serviceStatus,
          isSocketConnected: this.assets.isSocketConnected,
        }
      }
    }
  }

  async start(options: BinanceServiceStartOptions): Promise<boolean> {
    if (this.#isBusy) return false
    this.#isBusy = true

    this.#logger.log('Starting Binance client...')
    if (options.assetPairs.length > 1024) throw new Error(`BinanceClient: Max allowed assets is 1024 (Requested ${this.#assetPairs.length})`)
    if (options.assetPairs.length === 0) throw new Error(`BinanceClient: No assets where provided `)

    // TODO : Validate that requested assets exist in binance futures

    // empty assets array and insert provided assets
    clearArray(this.#assetPairs)
    this.#assetPairs.push(...options.assetPairs)

    // start child services
    await this.#api.start()
    await this.positions.start()
    await this.wallet.start()
    await this.assets.start({ assets: this.#assetPairs })
    await this.liquidations.start({ assets: this.#assetPairs })

    // done!
    this.#startTime = Date.now()
    this.#isBusy = false
    return true
  }

  async stop(): Promise<boolean> {
    if (this.#isBusy) return false
    this.#isBusy = true

    this.#logger.log('Stopping Binance client...')
    await this.#api.stop()
    await this.wallet.stop()
    await this.assets.stop()
    await this.liquidations.stop()
    if (this.#isBusy) return false

    // done!
    this.#startTime = 0
    this.#isBusy = false
    return true
  }
}

export default new BinanceService()
