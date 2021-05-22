import { getCompoundingCalculations, groupByDate } from "../helpers/index.js"

let dashboardHeaderDailyBreakdownChart = null

export function updateDashboardHeaderDailyBreakdownChart(data) {
  if (!dashboardHeaderDailyBreakdownChart) {
    console.log('failed initialise first daily profit chart')
    return
  }
  const distribution = groupByDate(data)
  const currentBalance = data[data.length - 1].totalBalance
  const projection = getCompoundingCalculations(distribution, currentBalance)

  // map data
  const coordinatesData = distribution.map(i => ({
    x: i.timestamp,
    y: i.profitPercent,
    meta: {
      profit: i.profit
    },
  }))
  // fill with average daily rremaining days
  for (const day of coordinatesData) {
    const today = Date.now()
    if (day.x > today) day.y = projection.monthAverageDailyProfitPercent
  }
  // set special color to sundays
  const colors = []
  for (const day of coordinatesData) {
    const today = Date.now()
    if (day.x > today) {
      colors.push('#286cad11')
    }
    else {
      const weekDay = new Date(day.x).getDay()
      if (weekDay === 0) colors.push('#286cad')
      else colors.push('#2286ff')
    }
  }
  // apply data
  dashboardHeaderDailyBreakdownChart.data.datasets[0].data = coordinatesData
  dashboardHeaderDailyBreakdownChart.data.datasets[0].backgroundColor = colors
  dashboardHeaderDailyBreakdownChart.data.datasets[0].borderColor = '#00000000'
  dashboardHeaderDailyBreakdownChart.update()
}

export function initDashboardHeaderDailyBreakdownChart() {
  const ctx = document.getElementById('dashboardHeaderDailyBreakdownGraph')
  dashboardHeaderDailyBreakdownChart = new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: [
        {
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
      aspectRatio: 1,
      animation: false,
      responsive: true,
      legend: false,
      tooltips: true,
      scales: {
        yAxes: [
          {
            display: false,
            position: 'right',
            ticks: {
              fontColor: '#d4d4d5',
              min: 0,
              beginAtZero: true,
              userCallback: function (label, index, labels) {
                // when the floored value is the same as the value we have a whole number
                if (Math.floor(label) === label) return label;
              },
            },
            gridLines: {
              display: false,
            },
          }
        ],
        xAxes: [
          {
            display: false,
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'lll',
              isoWeekday: true, // first day fpof the week monaday
            },
            gridLines: {
              display: false,
              color: '#ff0000',
            }
          }
        ]
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
          //returns a empty string if the label is "No Data"
          label: function (items, data) {
            let dataset = data.datasets[items.datasetIndex];
            if (dataset.label !== "No Data") {
              return `Profit: ${items.yLabel.toFixed(2)}% (${dataset.data[items.index].meta.profit.toFixed(2)}$)`
            } else {
              return ""
            }
          },
          //only returns something when at least one dataset yLabel is a valid number.
          title: function (t, e) {
            return ''
          }
        }
      },
    },
  })
}
