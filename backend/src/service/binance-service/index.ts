import FuturesSocketService from './futures-socket'
import PricesSocketService from './prices-socket'
import LiquidationsSocketService from './liquidations-socket'
import FuturesWalletService from './futures-wallet'

class BinanceService {
  constructor() {
    this.futuresSocket = new FuturesSocketService()
    this.pricesSocket = new PricesSocketService()
    this.liquidationsSocket = new LiquidationsSocketService()
    this.wallet = new FuturesWalletService(this.futuresSocket)
  }

  async start(): Promise<void> {
    await this.futuresSocket.start()
    await this.pricesSocket.start()
    await this.liquidationsSocket.start()
    await this.wallet.start()
  }

  public readonly futuresSocket: FuturesSocketService
  public readonly pricesSocket: PricesSocketService
  public readonly liquidationsSocket: LiquidationsSocketService
  public readonly wallet: FuturesWalletService
}

export default new BinanceService()
