import './lib/chart.js'
import api from './api/api.js'
import { downsample } from './common/array/index.js'
import { updateAccountStats } from './common/stats/index.js'
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
 import {getElapsedDays} from './common/time/index.js'


const TimeRange = {
  ALL_TIME : 'ALL_TIME',
  LAST_HOUR : 'LAST_HOUR',
  LAST_12_HOURS : 'LAST_12_HOURS',
  LAST_DAY : 'LAST_DAY',
  LAST_7_DAYS : 'LAST_7_DAYS',
  LAST_30_DAYS : 'LAST_30_DAYS',
  CUSTOM_RANGE : 'CUSTOM_RANGE',
}

let activetimeRange = TimeRange.LAST_DAY

async function init() {
  document.getElementById('resetDbButton').addEventListener('click', resetDb)
  document.getElementById('timeRangeSelector').addEventListener('change', setTimeRange)
  initOverviewChart()
  initTotalBalanceChart()
  initUsedBalanceChart()
  initOpenOrdersChart()
  initUnrealizedLostsChart()
  initDailyProfitChart()
  updateData()
  setInterval(updateData, 10000)
}

async function setTimeRange(a){
  activetimeRange = a.target.value
  await updateData()
}

async function resetDb(){
  await api.resetHistory()
  updateData()
}

async function updateData(){
  let futuresBalanceHistory
  const errorMessageContainer = document.getElementById('serviceError')
  let futuresPositions
  try{
    await getCoinbaseAlerts()
    futuresBalanceHistory = await api.getFuturesBalanceHistory()
    futuresPositions = await api.getFuturesPositions()
    errorMessageContainer.setAttribute('hidden', 'true')
  } catch(e){
    errorMessageContainer.removeAttribute('hidden')
    return
  }
  let data = []
  
  switch(activetimeRange){
    case TimeRange.ALL_TIME:{
      data = futuresBalanceHistory
      break
    }
    case TimeRange.LAST_HOUR:{
      data = filterByDate( Date.now() - (60 * 60 * 1000), Date.now(), futuresBalanceHistory)
      break
    }
    case TimeRange.LAST_12_HOURS:{
      data = filterByDate( Date.now() - (12 * 60 * 60 * 1000), Date.now(), futuresBalanceHistory)
      break
    }
    case TimeRange.LAST_DAY:{
      data = filterByDate( Date.now() - (24 * 60 *  60 * 1000), Date.now(), futuresBalanceHistory)
      break
    }
    case TimeRange.LAST_7_DAYS:{
      data = filterByDate( Date.now() - (7 * 24 * 60 * 60 * 1000), Date.now(), futuresBalanceHistory)
      break
    }
   case  TimeRange.LAST_30_DAYS:{
      data = filterByDate( Date.now() - (30 * 24 * 60 * 60 * 1000), Date.now(), futuresBalanceHistory)
      break
    }
   case  TimeRange.CUSTOM_RANGE:{
      console.log('NOT IMPLEMENTED')
      break
    }
    default : {
      throw new Error('Invalid time Range')
    }
  }

  const currentBalance = futuresBalanceHistory[futuresBalanceHistory.length-1].totalBalance
  updatePositions(futuresPositions, currentBalance)
  updateAccountStats(futuresBalanceHistory)
  updateOverviewChart(futuresBalanceHistory)
  updateDailyProfitChart(futuresBalanceHistory)
  updateTotalBalanceChart(data)
  updateUsedBalanceChart(data)
  updateOpenOrdersChart(data)
  updateUnrealizedLostsChart(data)
}

function updatePositions(futuresPositions, currentBalance){
  const takeProfit = 0.5
  const container = document.getElementById('openPositions')
  document.getElementById('openPositionsCount').innerText =futuresPositions.length

  let html = `
    <div class="position-table-header position-entry">
      <span></span>
      <span>symbol</span>
      <span>lev</span>
      <span>size</span>
      <span>amount</span>
      <span>PnL (ROE %)</span>
      <span class="only-desktop">Outcome</span>
      <span class="only-desktop">Distance</span>
      <span class="only-desktop">Idle</span>
    </div>
  `
  for(const position of futuresPositions){
    const margin = Number(position.markPrice) * Math.abs(Number(position.positionAmt)) / Number(position.leverage)
    const PnL = Number(position.unRealizedProfit)
    const ROE = (PnL * 100 * position.leverage) / (Math.abs(Number(position.positionAmt)) * Number(position.entryPrice) ) 
    const updateTimeInMin =Math.ceil( ( Date.now() - new Date(position.updateTime).getTime() ) / 1000 / 60 )
    const balancePercent = margin * 100 / currentBalance
    const priceDistanceFromOpening = ROE / position.leverage
    const priceDistanceFromLimitOrder = priceDistanceFromOpening > 0 
      ? priceDistanceFromOpening - takeProfit 
      : priceDistanceFromOpening + takeProfit
    const profitExpectet = takeProfit * Math.abs(margin) / 100  * position.leverage

    html += `
      <div class="position-entry">
        <span class="${position.positionAmt > 0 ? 'position-long': 'position-short'}"></span>
        <span>${position.symbol.slice(0,-4)}</span>
        <span class="position-leverage">${position.leverage}x</span>
        <span>${Math.abs(Number(position.positionAmt))}</span>
        <span>${margin.toFixed(2)}$ <span class="position-margin-percent">(${balancePercent.toFixed(2)}%) </span></span>
        <span class="${PnL < 0 ? 'position-pnl-negative' : 'position-pnl-positive'}">${PnL.toFixed(2)}$ (${ROE.toFixed(2)}%)</span>
        <span class="only-desktop">${profitExpectet.toFixed(2)}$</span>
        <span class="only-desktop">${priceDistanceFromLimitOrder.toFixed(2)}%</span>
        <span class="only-desktop">${updateTimeInMin} min</span>
      </div>
    `
  }
  container.innerHTML= html
}

function filterByDate(start, end, futuresBalanceHistory){
  return futuresBalanceHistory.filter(a=> a.timestamp > start && a.timestamp < end ) 
}

async function getCoinbaseAlerts(){
   const xml = await api.getCoinbaseAlerts()
   const parser = new DOMParser();
   const xmlDoc = parser.parseFromString(xml,"text/xml");
   const content = xmlDoc.getElementsByTagName('channel')[0].children
   const items=  Array.from(content).filter(i=> i.localName === 'item') 
  
   const entries = items.map(i=> {
     const title = Array.from(i.children).filter(c=> c.localName === 'title')[0].innerHTML
     const date =  Array.from(i.children).filter(c=> c.localName === 'pubDate')[0].innerHTML
     return {title, date}
    })
   
  const alerts = Object.values(entries).filter(i=>i.title.includes('available')||i.title.includes('launching'))
  document.getElementById('coinbaseAlerts').innerHTML =''
  for(const alert of alerts){

    const elapsedDays = getElapsedDays(new Date(alert.date), Date.now() )
    const a = `
      <div class="alert-entry">
        <div class="alert-date">${alert.date}</div>
        <div class="alert-title">${alert.title.replace("<![CDATA[", "").replace("]]>", "") }</div>
      </div>
    `
      document.getElementById('coinbaseAlerts').innerHTML +=a
     
  }
}

init().catch(e => {
  throw e
})
