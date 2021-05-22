import { getElapsedDays } from '../../lib/time/index.js'

export function getAccountStats(futuresBalanceHistory){
  const firstDateformatted =futuresBalanceHistory[0].date
  const firstDate = futuresBalanceHistory[0].timestamp
  const firstBalance =  futuresBalanceHistory[0].totalBalance
  const lastDate =  futuresBalanceHistory[futuresBalanceHistory.length-1].timestamp
  const lastDateformatted= futuresBalanceHistory[futuresBalanceHistory.length-1].date
  const lastBalance =  futuresBalanceHistory[futuresBalanceHistory.length-1].totalBalance
  const elapsedDays = getElapsedDays( firstDate,lastDate)
  const totalProfit =   lastBalance - firstBalance
  const dailyProfitAverage = ( totalProfit / elapsedDays )
  const dailyProfitAveragePercent =  dailyProfitAverage * 100 / lastBalance 

  // calculate today's profit
  const today = new Date();
  today.setHours(0,0,0,0);
  const todayMidnightTimestamp = today.getTime()
  let todayMidnightBalance = 0
  for(let i = futuresBalanceHistory.length - 1 ; i >= 0; i--){
    const entry = futuresBalanceHistory[i]
    if(entry.timestamp > todayMidnightTimestamp ) todayMidnightBalance = entry.totalBalance
    else break
  }
  const todayProfit = lastBalance - todayMidnightBalance
  const todayProfitPercentage = todayProfit * 100 / todayMidnightBalance 


  return {
    todayProfit,
    todayProfitPercentage,
    firstDateformatted,
    firstDate,
    firstBalance,
    lastDate,
    lastDateformatted,
    lastBalance,
    elapsedDays,
    totalProfit,
    dailyProfitAverage,
    dailyProfitAveragePercent
  }
}

export function updateAccountStats(futuresBalanceHistory){
  const accountStats = getAccountStats(futuresBalanceHistory)
  document.getElementById('startDate').innerHTML = accountStats.firstDateformatted
  document.getElementById('startBalance').innerHTML = accountStats.firstBalance.toFixed(2)+' USDT'
  document.getElementById('endDate').innerHTML = accountStats.lastDateformatted
  document.getElementById('endBalance').innerHTML = +accountStats.lastBalance.toFixed(2) +' USDT'
  document.getElementById('elapsedDays').innerHTML = accountStats.elapsedDays
  document.getElementById('totalProfit').innerHTML = accountStats.totalProfit.toFixed(2) +' USDT'
  
  document.getElementById('dailyProfitAmount').innerHTML = accountStats.todayProfit.toFixed(2) +'$'
  document.getElementById('dailyProfitAmountPercent').innerHTML = accountStats.todayProfitPercentage.toFixed(2) +'%'
}