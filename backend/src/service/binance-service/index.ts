import FuturesSocketService from './futures-socket'
import PricesSocketService from './prices-socket'
import FuturesWalletService from './futures-wallet'

class BinanceService {
  constructor() {
    this.futuresSocket = new FuturesSocketService()
    this.pricesSocket = new PricesSocketService()
    this.wallet = new FuturesWalletService(this.futuresSocket)
  }

  async start(): Promise<void> {
    await this.futuresSocket.start()
    await this.pricesSocket.start()
    await this.wallet.start()
  }

  public readonly futuresSocket: FuturesSocketService
  public readonly pricesSocket: PricesSocketService
  public readonly wallet: FuturesWalletService
}

export default new BinanceService()
