import database from '@/core/database'

export default {
  async load(from: number, to: number) {
    //
  },

  async save(datapoint: any) {
    const queryStr = `INSERT INTO datapoints (
        totalBalance,
        unrealizedLosts,
        unrealizedLostsPercent,
        usedBalance,
        usedBalancePercent, 
        openOrders, 
        timestamp, 
        date 
      )
      VALUES(
        ${datapoint.totalBalance},
        ${datapoint.unrealizedLosts},
        ${datapoint.unrealizedLostsPercent},
        ${datapoint.usedBalance},
        ${datapoint.usedBalancePercent},
        ${datapoint.openOrders},
        ${datapoint.timestamp}, 
        "${datapoint.date}"
      )
    `
    try{
      await database.query(queryStr)
    }catch(e){
      console.log('ERROR SAVING IN DB\n', queryStr)
    }
  }
}
