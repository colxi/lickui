import ErrorHandlingService from './service/error-handling'
import BinanceService from './service/binance-service'
import TradingBot from './service/trading-bot'
import { config } from './config'
import { LiquidationEvent } from './service/binance-service/futures-liquidations/types'
import fetch from 'node-fetch'
import { AssetName, CurrencyAmount } from './types'

// import initRESTApiService from './service/api-server'

// make Binance object available for debugging pùrposes (yarn debug + devtools)
(global as any).Binance = BinanceService

console.clear()

async function init(): Promise<void> {
  // TODO:  Get all available symbols, set leverage to X5 to all symbols, set all  symbols to isolated.
  await ErrorHandlingService.start()
  await TradingBot.start({ assetPairs: config.getEnabledAssetsList() })

}

init().catch(e => { throw e })

