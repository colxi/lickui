let totalBalanceChart = null 

export function updateUnrealizedLostsChart(data) {
  if(!totalBalanceChart) {
      console.log('initialise first urrealizedLostsChart')
      return
  }
  const coordinatesData = data.map(i => ({
    x: i.timestamp,
    y: i.unrealizedLostsPercent
  }))
  totalBalanceChart.data.datasets[0].data = coordinatesData
  totalBalanceChart.update()

  let total = 0
  let max = 0
  data.forEach(i =>{
    total+= i.unrealizedLostsPercent
    if(i.usedBalancePercent > max) max = i.unrealizedLostsPercent
  })
  document.getElementById('avg_unrealized_losts').innerHTML = (total / data.length).toFixed(2)+'%'
  document.getElementById('max_unrealized_losts').innerHTML = max +'%'
  document.getElementById('current_unrealized_losts').innerHTML = data[data.length-1].unrealizedLostsPercent + '%' + ' (' + data[data.length-1].unrealizedLosts.toFixed(2) +'$)'
}


export function initUnrealizedLostsChart() {
  const ctx = document.getElementById('unrealizedLostsChart')

  totalBalanceChart = new Chart(ctx, {
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
