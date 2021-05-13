import config from '/SERVER_CONFIG'

export default {
  getFuturesBalanceHistory: async function() {
    let page = 0
    const balanceHistory = []
    while (true) {
      const responseRaw = await fetch(
        `http://${config.apiServiceIp}:${config.apiServicePort}/futures/balance/history/${page}`
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
  }
 
}