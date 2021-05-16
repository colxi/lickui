
let dailyProfitChart = null

function daysInMonth (month, year = new Date().getFullYear()) {
  return new Date(year, month, 0).getDate();
}

function groupByDate( data ){
  const distribution=[]
  const currentMonth = new Date().getMonth() 
  const currentYear = new Date().getFullYear() 
  const currentMonthDays = daysInMonth(currentMonth)
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

function getCompoundingCalculations(distribution, currentBalance){
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
   const elapsedDays = today - firsIndexWithData
   let profitPercentSum = 0
   for(let i=firsIndexWithData; i <= today-1; i++){
     profitPercentSum += distribution[i].profitPercent
   }
   const profitPercentAverage = (profitPercentSum / elapsedDays) / 100
   const remaining = 30 - today
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


export function updateDailyProfitChart(data) {
  if(!dailyProfitChart) {
      console.log('failed initialise first daily profti hart')
      return
  }
  const distribution = groupByDate(data)
  const currentBalance = data[data.length-1].totalBalance
  const projection = getCompoundingCalculations(distribution, currentBalance)
  console.log(projection)
  const coordinatesData = distribution.map(i => ({
    x: i.timestamp,
    y: i.profitPercent,
    meta: { 
      profit: i.profit
    },
  }))
  dailyProfitChart.data.datasets[0].data = coordinatesData
  dailyProfitChart.update()
}


export function initDailyProfitChart() {
  const ctx = document.getElementById('dailyProfitPercentageChart')

  dailyProfitChart = new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: [
        {
          label: 'Daily profit',
          backgroundColor: '#2286ff',
          borderColor: '#2286ff',
          data: [],
          fill: true,
          borderWidth: 1,
          pointRadius: 0,
          tension: 0,
          showLine: true
        }
      ]
    },
    options: {
      animation: false,
      responsive: false,
      legend: false,
      tooltips: true,
      scales: {
        yAxes: [
          {
            position: 'right',
            ticks: {
              fontColor: '#d4d4d5',
              min: 0,
              beginAtZero: true,
              userCallback: function(label, index, labels) {
                  // when the floored value is the same as the value we have a whole number
                  if (Math.floor(label) === label) {
                      return label;
                  }

              },

            },
            gridLines:{
              display:false,
            },
          }
        ],
        xAxes: [
          {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'lll',
              isoWeekday: true, // first day fpof the week monaday
            },
            gridLines:{
              display:false,
              color:'#ff0000',
            },
            ticks:{
              fontColor: '#d4d4d5',
            },
            // type: 'time',
            // time: {
            //   parser: 'DD/MM/YYYY',
            //   round: 'day',
            //   displayFormats: {
            //     day: 'DD/MM/YYYY'
            //   }
            //}
          }
        ]
      },
      tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
                //returns a empty string if the label is "No Data"
                label: function(items, data){
                  let dataset = data.datasets[items.datasetIndex];
                  if(dataset.label !== "No Data") {
                      return `Profit: ${items.yLabel.toFixed(2)}% (${dataset.data[items.index].meta.profit.toFixed(2)}$)`
                  } else {
                      return ""
                  }
                },

                //only returns something when at least one dataset yLabel is a valid number.
                title: function(t, e) {
                    return '' 
                }
            }
        },

    },
  })
}
