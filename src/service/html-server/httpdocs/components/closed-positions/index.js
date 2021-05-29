import config from "/SERVER_CONFIG"

const ClosedOperationsSortBy = {
  SYMBOL: 'SYMBOL',
  TOTAL_OPERATIONS: 'TOTAL_OPERATIONS',
  AVERAGE_DURATION_IN_MIN: 'AVERAGE_DURATION_IN_MIN',
  AVERAGE_AMOUNT: 'AVERAGE_AMOUNT'
}

let sortBy = ClosedOperationsSortBy.TOTAL_OPERATIONS
let _positionsHistory = []

export function initPosittionsHistory() {
  const sortBySelector = document.getElementById('closedPositionsBreakdownSortBy')
  sortBySelector.addEventListener('change', () => {
    sortBy = sortBySelector.value
    updatePosittionsHistory()
  })
}

export async function updatePosittionsHistory(positionsHistory = _positionsHistory) {
  // cache the positions
  _positionsHistory = positionsHistory

  const totalCountDOM = document.getElementById('closed_total_count')
  const averageTimeDOM = document.getElementById('closed_average_time')
  const averageAmountDOM = document.getElementById('closed_average_amount')
  const averageProfitDOM = document.getElementById('closed_average_profit')

  const averageTimeInMin = getAverageByProperty(positionsHistory, 'duration') / 1000 / 60
  const averageAmountInDolars = getAverageByProperty(positionsHistory, 'amount')
  const averageProfitInDolars = (config.takeProfit * averageAmountInDolars / 100) * 4
  totalCountDOM.innerHTML = positionsHistory.length
  averageTimeDOM.innerHTML = `${averageTimeInMin.toFixed(2)}min`
  averageAmountDOM.innerHTML = `${averageAmountInDolars.toFixed(2)}$`
  averageProfitDOM.innerHTML = `${averageProfitInDolars.toFixed(2)}$`


  const closedPositionsHistory = document.getElementById('closedPositionsHistory')
  const dictionary = createDictionaryFromProperty(positionsHistory, 'symbol')

  // calculate averages and map to new object
  let operationsByAsset = Object.values(dictionary).map(i => ({
    symbol: i[0].symbol,
    totalOperations: i.length,
    averageDurationInMin: getAverageByProperty(i, 'duration') / 1000 / 60,
    averageAmount: getAverageByProperty(i, 'amount')
  }))

  // get sorting key and sort
  let sortKey
  if (sortBy === ClosedOperationsSortBy.SYMBOL) sortKey = 'symbol'
  else if (sortBy === ClosedOperationsSortBy.TOTAL_OPERATIONS) sortKey = 'totalOperations'
  else if (sortBy === ClosedOperationsSortBy.AVERAGE_AMOUNT) sortKey = 'averageDurationInMin'
  else if (sortBy === ClosedOperationsSortBy.SYMBOL) sortKey = 'averageAmount'
  operationsByAsset = operationsByAsset.sort((a, b) => a[sortKey] < b[sortKey] ? 1 : -1)

  document.getElementById('closedPositionsHistoryCount').innerHTML = operationsByAsset.length

  let html = ''
  for (const asset of operationsByAsset) {
    html += `
      <div class="closed-positions-history-entry">
        <span class="closed-positions-history-entry-symbol">${asset.symbol}</span>
        <span>${asset.totalOperations}</span>
        <span>${asset.averageAmount.toFixed(2)}$</span>
        <span>${asset.averageDurationInMin.toFixed(2)}min</span>
      </div>
      `
  }
  closedPositionsHistory.innerHTML = html
}

function getAverageByProperty(list, prop) {
  let total = 0
  for (const item of list) {
    total += item[prop]
  }
  return total / list.length
}

function createDictionaryFromProperty(list, prop) {
  let dictionary = {}
  for (const item of list) {
    if (!dictionary[item.symbol]) dictionary[item.symbol] = []
    dictionary[item.symbol].push(item)
  }
  return dictionary
}