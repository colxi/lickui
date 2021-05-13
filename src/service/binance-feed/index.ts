
import binanceApi from '@/core/binance-api'
import config from '@/core/config'
import database from '@/core/database'
import datapoints from '@/core/datapoints'


async function cycle(): Promise<void> {
	try{
	  const datapoint = await binanceApi.getBinanceData()
	  await datapoints.save(datapoint)
	}catch(e){
	  console.log('failed to fetch binance data. API ERR', e.message)
	  console.log('--')
	}
}


export default async function initBinanceFeedService(): Promise<void> {
    console.log('Initializing database...')
    await database.init()
    console.log('Starting binance futures Feed...')
    setInterval(cycle as any, config.updateIntervalInMillis)
}
