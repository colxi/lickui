import FuturesSocketService from './sockets/futures-socket'
import PricesSocketService from './sockets/prices-socket'
import LiquidationsSocketService from './sockets/liquidations-socket'
import FuturesWalletService from './futures-wallet'
import MarketInfoService from './asset-price'

class BinanceService {
  constructor() {
    this.futuresSocket = new FuturesSocketService()
    this.pricesSocket = new PricesSocketService()
    this.liquidationsSocket = new LiquidationsSocketService()
    this.wallet = new FuturesWalletService()
    this.market = new MarketInfoService(this.pricesSocket)

  }

  async start(): Promise<void> {
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

}

export default new BinanceService()
