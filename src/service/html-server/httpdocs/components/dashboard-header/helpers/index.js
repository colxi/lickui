import { getDaysInMonth } from "../../../lib/time/index.js"


export function groupByDate( data ){
  const distribution=[]
  const currentMonth = new Date().getMonth() 
  const currentYear = new Date().getFullYear() 
  const currentMonthDays = getDaysInMonth(currentMonth)
  // create month datastructure populated with 0s
  for(let i = 1 ; i < currentMonthDays +1 ;i++){
    distribution.push({
      timestamp : new Date(currentYear, currentMonth, i).setHours(0,0,0,0),
      profitPercent : 0,
      profit : 0,
      data: []
    })
  }
  // populate data structure with existing month data
  for(const entry of data){
    const date = new Date(entry.timestamp)
    const day = date.getDate()
    const month = date.getMonth() 
    const year = date.getFullYear()
    if(month !== currentMonth || year !==currentYear) continue
    distribution[day-1].data.push(entry)
  }
  // calculate and populate daily profit and profit eprcent 
  for(const entry of distribution){
    const startPrice = entry.data[0]?.totalBalance || 0
    const endPrice = entry.data[entry.data.length-1]?.totalBalance || 0
    const dayProfit = endPrice - startPrice
    const dayProfitPercent = dayProfit * 100 / startPrice
    entry.profitPercent = dayProfitPercent || 0
    entry.profit = dayProfit
  }
  return (distribution)
}

export function getCompoundingCalculations(distribution, currentBalance){
   // find month0s first day with activity
   let firsIndexWithData = distribution.length-1
   for(let i=0; i <= distribution.length-1; i++){
     const entry = distribution[i]
     if(entry.profit > 0 && entry.timestamp < distribution[firsIndexWithData].timestamp ) firsIndexWithData = i
    }
    // extract month initial balance
    const monthInitiaBalance = distribution[firsIndexWithData].data[0].totalBalance
    
   // calculate month active days average
   const date = new Date()
   const today = date.getDate()
   const monthDaysCount = new Date(date.getYear(), date.getMonth(), 0).getDate();
   // don't include today in the elapsed days count
   const elapsedDays = today - firsIndexWithData - 1
   // include today in the remaining days
   const remaining = monthDaysCount - today + 1
   let profitPercentSum = 0
   // don0t dinclude today in the calculation
   for(let i=firsIndexWithData; i <= today-2; i++){
     profitPercentSum += distribution[i].profitPercent
   }
   const profitPercentAverage = (profitPercentSum / elapsedDays) / 100
  

   // calculate compounding  for the rest of the month
   const monthlyProjectionWithCompounting =  currentBalance  * ( Math.pow(1 + profitPercentAverage, remaining) - 1) 

   const monthFinalBalance = currentBalance + monthlyProjectionWithCompounting
   const monthTotalProfit = monthFinalBalance- monthInitiaBalance
   const monthTotalProfitPercent = monthTotalProfit * 100 / monthInitiaBalance
   return {
     monthAverageDailyProfitPercent : profitPercentAverage * 100, 
     profitUntillEndOfMonth :monthlyProjectionWithCompounting,
     monthFinalBalance : monthFinalBalance,
     monthTotalProfit : monthTotalProfit,
     monthTotalProfitPercent :monthTotalProfitPercent
   }
}
