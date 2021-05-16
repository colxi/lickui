// import the library and some controllers
import { RESTApiServiceRoute } from 'rest-api-service'
import RESTApiService from 'rest-api-service'
import Controllers from './controllers'
import config from '@/core/config'


// declare api routes
const apiRoutes: RESTApiServiceRoute[] = [
  ['GET', '/futures/balance/history/:page', Controllers.futures.getFuturesBalanceHistory, false],
  ['GET', '/futures/positions', Controllers.futures.getFuturesPositions, false],
  ['GET', '/futures/balance/reset', Controllers.futures.resetData, false],
  ['GET', '/alerts/coinbase', Controllers.futures.coinbaseAlerts, false],
]

export default async function initRESTApiService() {
  // initialize service
  console.log('Initializing REST API service...')
  await RESTApiService.create(apiRoutes, {
    protocol: 'http',
    port: config.apiServicePort,
    verbose: true
  })
}
