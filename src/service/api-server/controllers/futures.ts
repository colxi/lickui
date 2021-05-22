import fetch from 'node-fetch'
import database from '@/core/database'
import { RESTApiServiceController, RESTApiServiceRequestPayload, RESTApiServiceRequestResponder } from 'rest-api-service'
import BinanceFeedService from '../../../service/binance-feed'

export const getFuturesBalanceHistoryDownsampled:RESTApiServiceController = async (
  response: RESTApiServiceRequestResponder,
  payload: RESTApiServiceRequestPayload,
  token: string
)=>{
  // downsample to granularity of 1 hour (instead of the 1 minute original)
  const downsampleRatio = 60
  const params = payload.params as Record<string, any>
  const limit = 1000
  const page = Number(params.page) || 0
  const entryOffset = limit * page
  if (!Number.isInteger(page) || page < 0) {
    response(400, { message: 'Page must be an integer equal or greater than 0' })
  }
  let tableTotalRowsDownsampled = await database.count('datapoints', `id % ${downsampleRatio} = 0`)
  // add an additional entry in the count as the last table  row  will be explicitly
  // attached on the last page request, to ensure, returned collection contains
  // the most up to date entry
  tableTotalRowsDownsampled++
  const data = await database.all(
    `SELECT * FROM datapoints WHERE id % ${downsampleRatio} = 0 LIMIT ${limit} OFFSET ${entryOffset}`
  )
  const total = Math.floor(tableTotalRowsDownsampled / limit) 
  // if is requested last page, inject the last table row at the end of the collection
  if(page === total){
    const lastRow =  await database.all(`SELECT * FROM datapoints ORDER BY id DESC LIMIT 1`)
    data.push(...lastRow)
  }
  response(200, { limit, page, total, data })
}

export const getFuturesBalanceHistory: RESTApiServiceController = async (
  response: RESTApiServiceRequestResponder,
  payload: RESTApiServiceRequestPayload,
  token: string
): Promise<void> => {
  const query = payload.query as Record<string, any>
  const params = payload.params as Record<string, any>
  const dateStart = Number(query.dateStart) || 0 
  const limit = 1000
  const page = Number(params.page) || 0
  const entryOffset = limit * page
  if (!Number.isInteger(page) || page < 0) {
    response(400, { message: 'Page must be an integer equal or greater than 0' })
  }
  const tableTotalRows = await database.count(`datapoints`, `timestamp > ${dateStart}`)
  const data = await database.all(
    `SELECT * FROM datapoints WHERE timestamp > ${dateStart} LIMIT ${limit} OFFSET ${entryOffset}`
  )
  const total = Math.floor(tableTotalRows / limit)
  response(200, { limit, page, total, data })
}


export const resetData: RESTApiServiceController = async (
  response: RESTApiServiceRequestResponder,
  payload: RESTApiServiceRequestPayload,
  token: string
): Promise<void> => {
  const tableTotalRows = await database.resetData(`datapoints`)
  response(200, { succeed: true })
}


export const getFuturesPositions: RESTApiServiceController = async (
  response: RESTApiServiceRequestResponder,
  payload: RESTApiServiceRequestPayload,
  token: string
): Promise<void> => {
  response(200, Object.values(BinanceFeedService.cachePositions))
}

export const getFuturesPositionsHistory: RESTApiServiceController = async (
  response: RESTApiServiceRequestResponder,
  payload: RESTApiServiceRequestPayload,
  token: string
): Promise<void> => {
  const dateStart = (payload.query as any).dateStart
  if(!dateStart) {
    response(500, {error:'Missing or invalid "dateStart" urlParameter'})
    return
  }
  const data = await database.all(`SELECT * FROM positions WHERE timestamp > ${dateStart}`)
  response(200, data)
}

export const coinbaseAlerts: RESTApiServiceController = async (
  response: RESTApiServiceRequestResponder,
  payload: RESTApiServiceRequestPayload,
  token: string
): Promise<void> => {
  const xml = await fetch('https://blog.coinbase.com/feed')
  const data = await xml.text()
  response(200, { data })
}


