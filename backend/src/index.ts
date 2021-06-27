import ErrorHandlingService from './service/error-handling'
import BinanceService from './service/binance-service'

// import binanceClient from './service/futures-account'
// import initRESTApiService from './service/api-server'
// import futuresWalletService from './service/futures-wallet'
// import indicatorsFeed from './service/indicators-feed'

console.clear()

async function init(): Promise<void> {
  // TODO:  Get all available symbols, set leverage to X5 to all symbols, set all  symbols to isolated.
  await ErrorHandlingService.start()
  await BinanceService.start()

}

init().catch(e => { throw e })

