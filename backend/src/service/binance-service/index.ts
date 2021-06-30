import FuturesSocketService from './sockets/futures-socket'
import PricesSocketService from './sockets/prices-socket'
import LiquidationsSocketService from './sockets/liquidations-socket'
import FuturesWalletService from './futures-wallet'
import MarketInfoService from './asset-price'
import Logger from '@/lib/logger'
import { LoggerConfigs } from './helpers'


class BinanceService {
  constructor() {
    this.#logger = new Logger(LoggerConfigs.binanceClient)

    this.wallet = new FuturesWalletService({
      logger: this.#logger.createChild(LoggerConfigs.futuresWalletService)
    })

    this.futuresSocket = new FuturesSocketService()
    this.pricesSocket = new PricesSocketService()
    this.liquidationsSocket = new LiquidationsSocketService()
    this.market = new MarketInfoService(this.pricesSocket)

  }

  async start(): Promise<void> {
    this.#logger.log('Starting Binance client...')
    await this.futuresSocket.start()
    await this.pricesSocket.start()
    await this.liquidationsSocket.start()
    await this.wallet.start()
    await this.market.start()
  }

  public readonly futuresSocket: FuturesSocketService
  public readonly pricesSocket: PricesSocketService
  public readonly liquidationsSocket: LiquidationsSocketService
  public readonly wallet: FuturesWalletService
  public readonly market: MarketInfoService

  #logger: Logger
}

export default new BinanceService()
