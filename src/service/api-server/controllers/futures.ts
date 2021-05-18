import fetch from 'node-fetch'
import database from '@/core/database'
import { RESTApiServiceController, RESTApiServiceRequestPayload, RESTApiServiceRequestResponder } from 'rest-api-service'
import binanceApi from '@/core/binance-api'

export const getFuturesBalanceHistory: RESTApiServiceController = async (
    response: RESTApiServiceRequestResponder,
    payload: RESTApiServiceRequestPayload,
    token: string
): Promise<void> => {

    const query = payload.query as Record<string, any>
    const params = payload.params as Record<string, any>
    const limit = 500
    const page = Number(params.page) || 0
    const entryOffset = limit * page

    if (!Number.isInteger(page) || page < 0) {
        response(400, { message: 'Page must be an integer equal or greater than 0' })
    }

    const tableTotalRows = await database.count(`datapoints`)
    const data = await database.all(`SELECT * FROM datapoints LIMIT ${limit} OFFSET ${entryOffset}`)
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
    let positions
    try{
     positions = await binanceApi.getOpenFuturesPositions()
    } catch(e){
        response(500, {error : e.message})
        return
    }
    response(200, positions)
}

export const coinbaseAlerts: RESTApiServiceController = async (
    response: RESTApiServiceRequestResponder,
    payload: RESTApiServiceRequestPayload,
    token: string
): Promise<void> => {
    const xml = await fetch('https://blog.coinbase.com/feed')
    const data = await xml.text()
    response(200, {data})
}


