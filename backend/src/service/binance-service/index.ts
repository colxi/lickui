import FuturesWalletService from './futures-wallet'
import FuturesAssetsService from './futures-assets'
// import FuturesSocketService from './sockets/futures-socket'
// import PricesSocketService from './asset-price/socket-manager'
// import LiquidationsSocketService from './sockets/liquidations-socket'
import Logger from '@/lib/logger'
import { LoggerConfigs } from './helpers'
import { CryptoAsset } from '@/types'
import { config } from '@/config'
import { getExchangeInfo } from './api'


interface BinanceServiceStartOptions {
  assetPairs: CryptoAsset[]
}
class BinanceService {
  constructor() {

    const binanceLogger = new Logger(LoggerConfigs.binanceClient)
    const futuresWalletServiceLogger = binanceLogger.createChild(LoggerConfigs.futuresWalletService)
    const futuresAssetServiceLogger = binanceLogger.createChild(LoggerConfigs.futuresAssetService)

    this.#enabledAssets = config.getEnabledAssetsList()
    this.#logger = binanceLogger
    this.wallet = new FuturesWalletService({ logger: futuresWalletServiceLogger })
    this.asset = new FuturesAssetsService({ logger: futuresAssetServiceLogger })

    // this.futuresSocket = new FuturesSocketService()
    // this.pricesSocket = new PricesSocketService()
    // this.liquidationsSocket = new LiquidationsSocketService()

  }

  #logger: Logger
  #enabledAssets: CryptoAsset[]
  public readonly wallet: FuturesWalletService
  public readonly asset: FuturesAssetsService
  // public readonly futuresSocket: FuturesSocketService
  // public readonly pricesSocket: PricesSocketService
  // public readonly liquidationsSocket: LiquidationsSocketService

  requestsLimits: {
    rateLimitType: 'REQUEST_WEIGHT' | 'ORDERS' | 'RAW_REQUESTS',
    interval: 'MINUTE' | 'SECOND' | 'DAY',
    intervalNum: number,
    limit: number
  }[] = []

  async start(options: BinanceServiceStartOptions): Promise<void> {
    this.#logger.log('Starting Binance client...')

    // get exchange limits
    const exchangeInfo = await getExchangeInfo()
    this.requestsLimits = exchangeInfo.rateLimits

    if (this.#enabledAssets.length > 1024) {
      throw new Error(`BinanceClient: Max allowed assets is 1024 (Requested ${this.#enabledAssets.length})`)
    }
    // TODO : Validate that requestes assets exist in binance futures

    await this.wallet.start()
    await this.asset.start({ assets: this.#enabledAssets })

    // await this.futuresSocket.start()
    // await this.pricesSocket.start()
    // await this.liquidationsSocket.start()
  }

}

export default new BinanceService()
