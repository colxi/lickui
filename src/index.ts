import initRESTApiService from './service/api-server'
import initBinanceFeedService from './service/binance-feed'
import initHTMLServerService from './service/html-server'

console.clear()

async function init(): Promise<void> {
  await initBinanceFeedService()
  await initRESTApiService()
  await initHTMLServerService()
}

init().catch(e => console.log('init error', e))

