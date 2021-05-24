import { timestampToDDMMYYYY } from '../../../lib/time/index.js'
let overviewChart = null

export function updateDashboardHeaderAllTimeChart(data) {
  if (!overviewChart) {
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

export function initDashboardHeaderAllTimeChart() {
  const ctx = document.getElementById('dashboardHeaderAllTimeGraph').getContext("2d")
  var gradientFill = ctx.createLinearGradient(0, 0, 0, 110);
  gradientFill.addColorStop(0, "rgba(128, 182, 244, 0.4)");
  gradientFill.addColorStop(1, "rgba(34, 134, 255, 0.0)");

  overviewChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        backgroundColor: gradientFill,
        borderColor: '#2286ff',
        fill: true,
        borderWidth: 0,
        pointRadius: 0,
        hitRadius: 10,
        tension: 0,
        showLine: true,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#3a74af'
      }]
    },
    options: {
      maintainAspectRatio: true,
      aspectRatio: 1,
      animation: false,
      responsive: true,
      legend: false,
      tooltips: true,
      layout: {
        padding: {
          left: -10
        }
      },
      interaction: {
        mode: 'point'
      },
      scales: {
        yAxes: [{
          display: false,
          gridLines: { display: false },
        }],
        xAxes: [{
          time: {
            unit: 'Areas',
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            display: false,
          }
        }]
      },
      tooltips: {
        mode: 'index',
        displayColors: false,
        padding: 18,
        caretPadding: 20,
        caretSize: 10,
        intersect: false,
        cornerRadius: 2,
        backgroundColor: '#eae6e6',
        titleFontColor: '#2f2f58',
        bodyFontColor: '#2286ff',
        callbacks: {
          label: function(item, data) {
            return `Balance: ${item.yLabel.toFixed(2)}$`
          },
          title: function(t, e) {
            const formattedDate = timestampToDDMMYYYY(t[0].xLabel)
            return formattedDate
          }
        }
      },
    }
  })
}