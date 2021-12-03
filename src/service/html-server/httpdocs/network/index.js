import config from '/SERVER_CONFIG'
import { ApiService } from '../api/api.js'

const container = document.getElementById('network')

const servers = []

function initDOM() {
  for (const server of config.network) {
    const entry = document.createElement('div')
    entry.innerText = server.name
    entry.className = 'server'
    entry.addEventListener('click', () => (document.location = server.url))
    container.appendChild(entry)
  }
}

async function loop() {
  for (const server of servers) {
    const balanceHistory = await server.apiService.getFuturesBalanceHistory()
    const currentBalanceData = balanceHistory.pop()
    const {
      totalBalance,
      usedBalance,
      usedBalancePercent,
      unrealizedLosts,
      unrealizedLostsPercent
    } = currentBalanceData
  }
}

async function start() {
  for (const server of config.network) {
    servers.push({
      ...server,
      apiService: new ApiService(server.api)
    })
  }
  initDOM()
  await loop()
}

start().catch(e => {
  throw e
})
