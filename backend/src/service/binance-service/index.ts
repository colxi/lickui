import FuturesSocketService from './futures-socket'
import FuturesWalletService from './futures-wallet'

class BinanceService {
  constructor() {
    this.socket = new FuturesSocketService()
    this.wallet = new FuturesWalletService(this.socket)
  }

  async start(): Promise<void> {
    await this.socket.start()
    await this.wallet.start()
  }

  public readonly socket: FuturesSocketService
  public readonly wallet: FuturesWalletService
}

export default new BinanceService()
