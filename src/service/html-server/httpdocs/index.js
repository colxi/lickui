import './lib/chart.js'
import api from './api/api.js'
import { updateAccountStats } from './common/stats/index.js'
import { TimeRange, filterByTimeRange, getTimeRangeStartDate } from './lib/time/index.js'
import { updatePositions } from './components/open-positions/index.js'
import { updateCoinbaseAlerts } from './components/coinbase-alerts/index.js'
import { updatePosittionsHistory } from './components/closed-positions/index.js'
import { includeComponents } from './lib/include/index.js'
import { hideLoader, showLoader } from './components/loader/index.js'
import { showErrorMessage, hideErrorMessage } from './components/error-notification/index.js'
import {
  initUsedBalanceChart,
  initOpenOrdersChart,
  initTotalBalanceChart,
  initUnrealizedLostsChart,
  updateUsedBalanceChart,
  updateOpenOrdersChart,
  updateTotalBalanceChart,
  updateUnrealizedLostsChart,
} from './common/chart/index.js'
import { initDashboardHeader, updateDashboardHeader } from './components/dashboard-header/index.js'


let activetimeRange = TimeRange.TODAY

init().catch(e => { throw e })

async function init() {
  await includeComponents()
  document.getElementById('resetDbButton').addEventListener('click', resetDb)
  document.getElementById('timeRangeSelector').addEventListener('change', setTimeRange)
  initDashboardHeader()

  initTotalBalanceChart()
  initUsedBalanceChart()
  initOpenOrdersChart()
  initUnrealizedLostsChart()

  // set interval for polling service
  // setInterval(refreshData, 30000)
  refreshData()
}


async function refreshData() {
  showLoader()
  hideErrorMessage()
  let data
  try {
    data = await fetchData()
  } catch (e) {
    hideLoader()
    showErrorMessage()
    throw e
  }
  updateView(data)
  hideLoader()
}

async function fetchData() {
  const startTime = getTimeRangeStartDate(activetimeRange)

  const [
    futuresBalanceFullHistoryDownsampled,
    futuresBalanceHistory,
    futuresBalanceHistoryCurrentMonth,
    futuresPositions,
    futuresPositionsHistory,
    coinbaseAlerts
  ] = await Promise.all([
    api.getFuturesBalanceHistoryDownsampled(),
    api.getFuturesBalanceHistory(startTime),
    api.getFuturesBalanceHistory(getTimeRangeStartDate(TimeRange.CURRENT_MONTH)),
    api.getFuturesPositions(),
    api.getFuturesPositionsHistory(startTime),
    api.getCoinbaseAlerts()
  ])

  console.log(futuresBalanceFullHistoryDownsampled,
    futuresBalanceHistory,
    futuresBalanceHistoryCurrentMonth,
    futuresPositions,
    futuresPositionsHistory,
    coinbaseAlerts)

  const currentBalance = futuresBalanceHistory[futuresBalanceHistory.length - 1].totalBalance
  return {
    futuresBalanceHistoryCurrentMonth,
    futuresBalanceFullHistoryDownsampled,
    futuresBalanceHistory,
    futuresPositions,
    futuresPositionsHistory,
    coinbaseAlerts,
    currentBalance
  }
}

function updateView(data) {
  updateDashboardHeader(data.futuresBalanceFullHistoryDownsampled, data.futuresBalanceHistoryCurrentMonth)

  updateCoinbaseAlerts(data.coinbaseAlerts)
  updatePosittionsHistory(data.futuresPositionsHistory)
  updatePositions(data.futuresPositions, data.currentBalance)
  updateAccountStats(data.futuresBalanceHistory)
  updateTotalBalanceChart(data.futuresBalanceHistory)
  updateUsedBalanceChart(data.futuresBalanceHistory)
  updateOpenOrdersChart(data.futuresBalanceHistory)
  updateUnrealizedLostsChart(data.futuresBalanceHistory)

}

async function setTimeRange(a) {
  activetimeRange = a.target.value
  await refreshData()
}

async function resetDb() {
  const reset = confirm('Reset database?')
  if (reset) {
    await api.resetHistory()
    updateData()
  }
}