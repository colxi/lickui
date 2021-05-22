import { initDashboardHeaderAllTimeChart, updateDashboardHeaderAllTimeChart } from "./charts/all-time.js"
import { initDashboardHeaderDailyBreakdownChart, updateDashboardHeaderDailyBreakdownChart } from "./charts/daily-breakdown.js"
import { getCompoundingCalculations, groupByDate } from "./helpers/index.js"

export function initDashboardHeader() {
  // initialize graphs
  initDashboardHeaderDailyBreakdownChart()
  initDashboardHeaderAllTimeChart()
  selectDashboardHeaderChart('month')
  // initialize graph selector buttons
  const graphSelectorAllButton = document.getElementById('dashboardHeaderGraphSelectorAll')
  const graphSelectorMonthButton = document.getElementById('dashboardHeaderGraphSelectorMonth')
  graphSelectorAllButton.addEventListener('click', ()=>selectDashboardHeaderChart('all'))
  graphSelectorMonthButton.addEventListener('click', ()=>selectDashboardHeaderChart('month'))
}

export function updateDashboardHeader(dataDownsampled, montcurrentMonthData) {
  // update charts
  updateDashboardHeaderDailyBreakdownChart(montcurrentMonthData)
  updateDashboardHeaderAllTimeChart(dataDownsampled)
  // update header data fields
  // ...

  const distribution = groupByDate(montcurrentMonthData)
  const currentBalance = montcurrentMonthData[montcurrentMonthData.length-1].totalBalance
  const projection = getCompoundingCalculations(distribution, currentBalance)
  document.getElementById('month_daily_average').innerText = `${projection.monthAverageDailyProfitPercent.toFixed(2)}%`
  document.getElementById('month_expected_profit').innerText = `${projection.monthTotalProfit.toFixed(2)}$ (${projection.monthTotalProfitPercent.toFixed(2)}%)`
  document.getElementById('mont_expected_pending_profit').innerText = `${projection.profitUntillEndOfMonth.toFixed(2)}$`
 

}

function selectDashboardHeaderChart(chart) {
  const monthChart = document.getElementById('dashboardHeaderDailyBreakdownGraph')
  const allChart =document.getElementById('dashboardHeaderAllTimeGraph')
  if(chart === 'month'){
    allChart.setAttribute('hidden', 'true')
    monthChart.removeAttribute('hidden')
  }
  if(chart === 'all'){
    monthChart.setAttribute('hidden', 'true')
    allChart.removeAttribute('hidden')
  }
} 
