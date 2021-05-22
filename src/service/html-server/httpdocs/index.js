import './lib/chart.js'
import api from './api/api.js'
import { updateAccountStats } from './common/stats/index.js'
import { TimeRange, filterByTimeRange } from './lib/time/index.js'
import { updatePositions } from './components/open-positions/index.js'
import { updateCoinbaseAlerts } from './components/coinbase-alerts/index.js'
import { updatePosittionsHistory } from './components/closed-positions/index.js'
import { includeComponents } from './lib/include/index.js'
import { hideLoader, showLoader } from './components/loader/index.js'
import { showErrorMessage, hideErrorMessage } from './components/error-notification/index.js'
import {
  initOverviewChart,
  initUsedBalanceChart,
  initOpenOrdersChart,
  initTotalBalanceChart,
  initUnrealizedLostsChart,
  initDailyProfitChart,
  updateOverviewChart,
  updateUsedBalanceChart,
  updateOpenOrdersChart,
  updateTotalBalanceChart,
  updateUnrealizedLostsChart,
  updateDailyProfitChart,
} from './common/chart/index.js'

let activetimeRange = TimeRange.TODAY

init().catch(e => { throw e })

async function init() {
  await includeComponents()
  document.getElementById('resetDbButton').addEventListener('click', resetDb)
  document.getElementById('timeRangeSelector').addEventListener('change', setTimeRange)
  initOverviewChart()
  initTotalBalanceChart()
  initUsedBalanceChart()
  initOpenOrdersChart()
  initUnrealizedLostsChart()
  initDailyProfitChart()
  // set interval for polling service
  setInterval(refreshData, 30000)
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
    return
  }
  updateView(data)
  hideLoader()
}


async function fetchData(){
  let futuresBalanceHistory =  await api.getFuturesBalanceHistory()
  let futuresPositions = await api.getFuturesPositions()
  let futuresPositionsHistory = await api.getFuturesPositionsHistory(new Date().setHours(0, 0, 0, 0))
  let coinbaseAlerts =  await api.getCoinbaseAlerts()
  let futuresBalanceHistoryFiltered = filterByTimeRange(futuresBalanceHistory, activetimeRange)
  const currentBalance = futuresBalanceHistory[futuresBalanceHistory.length - 1].totalBalance
  return {
    futuresBalanceHistory, 
    futuresPositions,
    futuresPositionsHistory,
    coinbaseAlerts,
    futuresBalanceHistoryFiltered,
    currentBalance
  }
}

function updateView(data){
  updateCoinbaseAlerts(data.coinbaseAlerts)
  updatePosittionsHistory(data.futuresPositionsHistory)
  updatePositions(data.futuresPositions, data.currentBalance)
  updateAccountStats(data.futuresBalanceHistory)
  updateOverviewChart(data.futuresBalanceHistory)
  updateDailyProfitChart(data.futuresBalanceHistory)
  updateTotalBalanceChart(data.futuresBalanceHistoryFiltered)
  updateUsedBalanceChart(data.futuresBalanceHistoryFiltered)
  updateOpenOrdersChart(data.futuresBalanceHistoryFiltered)
  updateUnrealizedLostsChart(data.futuresBalanceHistoryFiltered)
}

async function setTimeRange(a) {
  activetimeRange = a.target.value
  await updateData()
}

async function resetDb() {
  const reset = confirm('Reset database?')
  if (reset) {
    await api.resetHistory()
    updateData()
  }
}

