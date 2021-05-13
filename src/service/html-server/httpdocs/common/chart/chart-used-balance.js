let usedBalanceChart = null 

export function updateUsedBalanceChart(data) {
  if(!usedBalanceChart) {
      console.log('initialise first usedBalanceChart')
      return
  }
  const coordinatesData = data.map(i => ({
    x: i.timestamp,
    y: i.usedBalancePercent
  }))
  usedBalanceChart.data.datasets[0].data = coordinatesData
  usedBalanceChart.update()
  
  let total = 0
  let min = 0
  let max = 0
  data.forEach(i =>{
    total+= i.usedBalancePercent
    if(i.usedBalancePercent > max) max = i.usedBalancePercent
    if(i.usedBalancePercent < min) min = i.usedBalancePercent
  })
  document.getElementById('used_balance_time_range').innerHTML = (total / data.length).toFixed(2)+'%'
  document.getElementById('min_balance_time_range').innerHTML = min +'%'
  document.getElementById('max_balance_time_range').innerHTML = max +'%'
  document.getElementById('current_balance_time_range').innerHTML = data[data.length-1].usedBalancePercent + '%'
}


export function initUsedBalanceChart(downsampled) {
  const ctx = document.getElementById('balancePercentChart')

  usedBalanceChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'My First dataset',
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
              max: 100
            },
            gridLines:{
              display:true,
              color:'#265690',
              borderDash: [2],
              borderDashOffset:4
            },
          }
        ],
        xAxes: [
          {
            gridLines:{
              display:false,
              color:'#ff0000',
            },
            type: 'time',
            ticks:{
              fontColor: '#d4d4d5',
            },
            time: {
              isoWeekday: true, // first day fpof the week monaday
              parser: 'MM/DD/YYYY HH:mm'
              //round: 'day',
              // tooltipFormat: 'll DD/MM'
              // displayFormats: {
              //   day: 'MM/DD/YYYY'
              // }
            }
          }
        ]
      }
    }
  })
}