import initRESTApiService from './service/api-server'
import BinanceFeedService from './service/binance-feed'
import ErrorTracking from './service/error-tracking'
import initHTMLServerService from './service/html-server'

console.clear()

async function init(): Promise<void> {
  ErrorTracking.init()
  await BinanceFeedService.init()
  await initRESTApiService()
  await initHTMLServerService()
}

init().catch(e => console.log('init error', e))

