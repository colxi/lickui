
let openOrdersChart = null

export function updateOpenOrdersChart(data) {
  if(!openOrdersChart) {
      console.log('initialise first openOrdersChart')
      return
  }
  const coordinatesData = data.map(i => ({
    x: i.timestamp,
    y: i.openOrders
  }))
  openOrdersChart.data.datasets[0].data = coordinatesData
  openOrdersChart.update()
}


export function initOpenOrdersChart(downsampled) {
  const ctx = document.getElementById('openOrdersChart')

  openOrdersChart = new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: '#ffffff',
          borderColor: '#ffffff',
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
