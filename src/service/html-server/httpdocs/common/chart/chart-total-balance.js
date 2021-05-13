let totalBalanceChart = null 

export function updateTotalBalanceChart(data) {
  if(!totalBalanceChart) {
      console.log('initialise first totalBalanceChart')
      return
  }
  const coordinatesData = data.map(i => ({
    x: i.timestamp,
    y: i.totalBalance
  }))
  totalBalanceChart.data.datasets[0].data = coordinatesData
  totalBalanceChart.update()
}


export function initTotalBalanceChart(downsampled) {
  const ctx = document.getElementById('totalBalanceChart')

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
              // min: 0,
              //  max: 100
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


//*** charting view

// export function renderTVBalanceChart(downsampled) {
//   const volumeDatasetTV = downsampled.map(i => ({
//     time: Math.round(i.timestamp / 1000),
//     value: i.openOrders
//   }))

//   const balanceDatasetTV = downsampled.map(i => ({
//     time: Math.round(i.timestamp / 1000),
//     value: i.totalBalance
//   }))

//   const chart = LightweightCharts.createChart(document.getElementById('test'), {
//     width: 700,
//     height: 300
//   })

//   const darkTheme = {
//     chart: {
//       timeScale: {
//         rightOffset: 12,
//         rightBarStaysOnScroll: true,
//         //barSpacing: 3,
//         borderVisible: false,
//         borderColor: '#fff000',
//         visible: true,
//         timeVisible: true,
//         secondsVisible: false,
//         tickMarkFormatter: (time, tickMarkType, locale) => {
//           const hour = new Date(time * 1000).getUTCHours()
//           const minute = new Date(time * 1000).getUTCMinutes()
//           const date = new Date(time * 1000).getUTCDate()
//           return hour === 0 ? date : hour + ':' + minute
//         }
//       },
//       layout: {
//         backgroundColor: '#2B2B43',
//         lineColor: '#2B2B43',
//         textColor: '#D9D9D9'
//       },
//       watermark: {
//         color: 'rgba(0, 0, 0, 0)'
//       },
//       crosshair: {
//         color: '#758696'
//       },
//       grid: {
//         vertLines: {
//           color: '#2B2B43'
//         },
//         horzLines: {
//           color: '#363C4E'
//         }
//       }
//     },
//     series: {
//       topColor: 'rgba(32, 226, 47, 0.56)',
//       bottomColor: 'rgba(32, 226, 47, 0.04)',
//       lineColor: 'rgba(32, 226, 47, 1)'
//     }
//   }
//   chart.applyOptions(darkTheme.chart)

//   const lineSeries = chart.addLineSeries()
//   lineSeries.setData(balanceDatasetTV)

//   const volumeSeries = chart.addHistogramSeries({
//     priceFormat: {
//       type: 'volume'
//     },
//     base: 0,
//     priceLineVisible: false,
//     color: '#2286FF',
//     priceScaleId: '',
//     scaleMargins: {
//       top: 0.78,
//       bottom: 0
//     }
//   })

//   volumeSeries.setData(volumeDatasetTV)
// }
