import config from '/SERVER_CONFIG'

export default { 
  getFuturesBalanceHistoryDownsampled: async function() {
    let page = 0
    const balanceHistory = []
    while (true) {
      const responseRaw = await fetch(
        `http://${config.apiServiceIp}:${config.apiServicePort}/futures/balance/history/downsampled/${page}`
      )
      const response = await responseRaw.json()
      balanceHistory.push(...response.data)
      page++
      if (page > response.total) break
    }
    return balanceHistory
  },

  getFuturesBalanceHistory: async function(dateStart= 0) {
    let page = 0
    const balanceHistory = []
    while (true) {
      const responseRaw = await fetch(
        `http://${config.apiServiceIp}:${config.apiServicePort}/futures/balance/history/${page}?dateStart=${dateStart}`
      )
      const response = await responseRaw.json()
      balanceHistory.push(...response.data)
      page++
      if (page > response.total) break
    }
    return balanceHistory
  },

  resetHistory: async function() {
    const responseRaw = await fetch(
      `http://${config.apiServiceIp}:${config.apiServicePort}/futures/balance/reset`
    )
    const response = await responseRaw.json()
    return response
  },

  getCoinbaseAlerts: async function() {
    const responseRaw = await fetch(`http://${config.apiServiceIp}:${config.apiServicePort}/alerts/coinbase`)
    const response = await responseRaw.json()
    return response.data
  },
 
  getFuturesPositions: async function() {
    const responseRaw = await fetch(`http://${config.apiServiceIp}:${config.apiServicePort}/futures/positions`)
    const response = await responseRaw.json()
    if(responseRaw.status !== 200) throw new Error(response?.error || '500 Response')
    return response
  },

  getFuturesPositionsHistory: async function(dateStart=0){
    const responseRaw = await fetch(`http://${config.apiServiceIp}:${config.apiServicePort}/futures/positions/history/?dateStart=${dateStart}`)
    const response = await responseRaw.json()
    if(responseRaw.status !== 200) throw new Error(response?.error || '500 Response')
    return response
  }
}
