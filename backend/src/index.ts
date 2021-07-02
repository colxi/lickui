import ErrorHandlingService from './service/error-handling'
import BinanceService from './service/binance-service'
import { config } from './config'

// import binanceClient from './service/futures-account'
// import initRESTApiService from './service/api-server'
// import futuresWalletService from './service/futures-wallet'
// import indicatorsFeed from './service/indicators-feed'


console.clear()

function validate() {
  const activeCoinsCount = Object.values(config.assets).filter(i => i.enabled).length
  console.log('ENABLED COINS :', activeCoinsCount)
  if (activeCoinsCount > 199) throw new Error('a maximum of 199 coins are allowed simultanously')
}

async function init(): Promise<void> {
  // TODO:  Get all available symbols, set leverage to X5 to all symbols, set all  symbols to isolated.
  await ErrorHandlingService.start()
  validate()
  await BinanceService.start({
    assetPairs: config.getEnabledAssetsList()
  })
}

init().catch(e => { throw e })

