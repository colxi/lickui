import './lib/chart.js'
import {
  renderColumnPlugin,
  renderHorizontalLinePlugin
} from './plugins/index.js'

export function initializeChartJS() {
  Chart.pluginService.register(renderColumnPlugin)
  Chart.pluginService.register(renderHorizontalLinePlugin)
}