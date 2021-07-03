import FuturesWalletService from './futures-wallet'
import FuturesAssetsService from './futures-assets'
// import FuturesSocketService from './sockets/futures-socket'
// import PricesSocketService from './asset-price/socket-manager'
// import LiquidationsSocketService from './sockets/liquidations-socket'
import Logger from '@/lib/logger'
import { LoggerConfigs } from './helpers'
import { CryptoAsset } from '@/types'
import { config } from '@/config'


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


  async start(options: BinanceServiceStartOptions): Promise<void> {
    this.#logger.log('Starting Binance client...')
    void (options)
    await this.wallet.start()
    await this.asset.start({ assets: this.#enabledAssets })

    // await this.futuresSocket.start()
    // await this.pricesSocket.start()
    // await this.liquidationsSocket.start()
  }

}

export default new BinanceService()
