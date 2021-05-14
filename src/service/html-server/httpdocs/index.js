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

  try{
    await getCoinbaseAlerts()
    futuresBalanceHistory = await api.getFuturesBalanceHistory()
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

  updateAccountStats(futuresBalanceHistory)
  updateOverviewChart(futuresBalanceHistory)
  updateDailyProfitChart(futuresBalanceHistory)
  updateTotalBalanceChart(data)
  updateUsedBalanceChart(data)
  updateOpenOrdersChart(data)
  updateUnrealizedLostsChart(data)
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
 //  console.log( Array.from(content).filter(i=> i.localName === 'item') )

   //window.a= content
}

init().catch(e => {
  throw e
})
