import config from '/SERVER_CONFIG'

export class ApiService {
  constructor(host) {
    if (!host) throw new Error(`Invalid host provided (${host})`)
    this.host = host
  }

  host = ''

  async getFuturesBalanceHistoryDownsampled() {
    let page = 0
    const balanceHistory = []
    while (true) {
      const responseRaw = await fetch(`${this.host}/futures/balance/history/downsampled/${page}`)
      const response = await responseRaw.json()
      balanceHistory.push(...response.data)
      page++
      if (page > response.total) break
    }
    return balanceHistory
  }

  async getFuturesBalanceHistory(dateStart = 0) {
    let page = 0
    const balanceHistory = []
    while (true) {
      const responseRaw = await fetch(
        `${this.host}/futures/balance/history/${page}?dateStart=${dateStart}`
      )
      const response = await responseRaw.json()
      balanceHistory.push(...response.data)
      page++
      if (page > response.total) break
    }
    return balanceHistory
  }

  async resetHistory() {
    const responseRaw = await fetch(`${this.host}/futures/balance/reset`)
    const response = await responseRaw.json()
    return response
  }

  async getCoinbaseAlerts() {
    const responseRaw = await fetch(`${this.host}/alerts/coinbase`)
    const response = await responseRaw.json()
    return response.data
  }

  async getFuturesPositions() {
    const responseRaw = await fetch(`${this.host}/futures/positions`)
    const response = await responseRaw.json()
    if (responseRaw.status !== 200) throw new Error(response?.error || '500 Response')
    return response
  }

  async getFuturesPositionsHistory(dateStart = 0) {
    const responseRaw = await fetch(
      `${this.host}/futures/positions/history/?dateStart=${dateStart}`
    )
    const response = await responseRaw.json()
    if (responseRaw.status !== 200) throw new Error(response?.error || '500 Response')
    return response
  }
}

export default new ApiService(`http://${config.apiServiceIp}:${config.apiServicePort}`)
