import database from '@/database'
import { RESTApiServiceController, RESTApiServiceRequestPayload, RESTApiServiceRequestResponder } from 'rest-api-service'

export const getFuturesBalanceHistory: RESTApiServiceController = async (
   response: RESTApiServiceRequestResponder,
   payload: RESTApiServiceRequestPayload,
): Promise<void> => {
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

// export const getFuturesOpenPositions: RESTApiServiceController = async (
//    response: RESTApiServiceRequestResponder,
//    payload: RESTApiServiceRequestPayload,
// ): Promise<void> => {
//    response(200, {
//       // futuresWallet: binanceFuturesService.futuresWallet,
//       // futuresPositions: binanceFuturesService.futuresPositions
//    })
// }
