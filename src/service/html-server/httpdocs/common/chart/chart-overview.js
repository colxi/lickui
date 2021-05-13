import theme from './charts-theme.js'

let overviewChart = null

export function updateOverviewChart(data) {
  if(!overviewChart) {
      console.log('initialise first overviewChart')
      return
  }
  const coordinatesData = data.map(i => ({
    x: i.timestamp,
    y: i.totalBalance
  }))
  overviewChart.data.datasets[0].data = coordinatesData
  overviewChart.update()
}

export function initOverviewChart() {
  const ctx = document.getElementById('timeRange')
  //ctx.height = '75'
  overviewChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          backgroundColor: theme.background,
          borderColor: theme.background,
          fill: true,
          borderWidth: 0,
          pointRadius: 0,
          tension: 0,
          showLine: true
        }
      ]
    },
    options: {
      aspectRatio: 1 ,
      animation: false,
      responsive: true,
      legend: false,
      tooltips: false,
      scales: {
        yAxes: [
          {
            display:false,
            position: 'right',
            ticks: {
              fontColor: '#d4d4d5',
              // min: 0,
              // beginAtZero: true,
              userCallback: function(label, index, labels) {
                // when the floored value is the same as the value we have a whole number
                if (Math.floor(label) === label)   return label;
              },

            },
            gridLines:{  display:false },
          }
        ],
        xAxes: [
          {
            time: {
              unit: 'Areas',
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              maxTicksLimit: 7,
              display: false, //this removed the labels on the x-axis
            }
          }
        ]
      }
    }
  })
}

