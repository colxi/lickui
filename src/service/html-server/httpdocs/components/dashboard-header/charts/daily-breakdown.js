import { timestampToDDMMYYYY } from "../../../lib/time/index.js"
import { getCompoundingCalculations, groupByDate } from "../helpers/index.js"

let dashboardHeaderDailyBreakdownChart = null

export function updateDashboardHeaderDailyBreakdownChart(data) {
  if (!dashboardHeaderDailyBreakdownChart) {
    console.log('failed to initialise daily breakdown graph')
    return
  }
  const distribution = groupByDate(data)
  const currentBalance = data[data.length - 1].totalBalance
  const projection = getCompoundingCalculations(distribution, currentBalance)

  // prepare data to feed the graph
  const coordinatesData = distribution.map(i => ({
    x: i.timestamp,
    y: i.profitPercent,
    meta: { profit: i.profit },
  }))

  // create a map of colors, containing the color
  // for each day of the month, coloring sundats darker, ti 
  // help identifying week cicles
  const colors = []
  for (const day of coordinatesData) {
    const weekDay = new Date(day.x).getDay()
    colors.push(weekDay === 0 ? '#286cad' : '#2286ff')
  }

  // set aaverage line
  dashboardHeaderDailyBreakdownChart.options.drawHorizontalLine.text = `AVG=${projection.monthAverageDailyProfitPercent.toFixed(2)}`

  dashboardHeaderDailyBreakdownChart.options.drawHorizontalLine.lineY = [
      projection.monthAverageDailyProfitPercent,
      projection.monthAverageDailyProfitPercent
    ]
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
      datasets: [{
        data: [],
        fill: true,
        borderWidth: 1,
      }]
    },
    options: {
      maintainAspectRatio: true,
      aspectRatio: 1,
      animation: false,
      responsive: true,
      legend: false,
      tooltips: true,
      scales: {
        yAxes: [{
          display: false,
          gridLines: {
            display: false,
          },
        }],
        xAxes: [{
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
          label: function(items, data) {
            let dataset = data.datasets[items.datasetIndex];
            const profitPercent = items.yLabel.toFixed(2)
            const profitUsd = dataset.data[items.index].meta.profit.toFixed(2)
            return `Profit: ${profitPercent}% (${profitUsd}$)`
          },
          title: function(t, e) {
            const date = new Date(t[0].xLabel)
            const formattedDate = timestampToDDMMYYYY(date.getTime())
            return formattedDate
          }
        }
      },
      drawHorizontalLine: {
        lineY: [0, 0], // set dinamycaly on data update
        lineColor: 'rgba(238, 238, 0, 0.8)',
        text: 'AVG=', // set dinamycally on dat update
        textPosition: 0,
        textFont: '10px verdana',
        textColor: 'rgba(238, 238, 0, 0.8)'
      }
    },
  })
}