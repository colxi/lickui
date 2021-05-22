
export async function updatePosittionsHistory(positionsHistory) {
    const totalCountDOM = document.getElementById('closed_total_count')
    const averageTimeDOM = document.getElementById('closed_average_time')
    const averageAmountDOM = document.getElementById('closed_average_amount')
    const averageProfitDOM = document.getElementById('closed_average_profit')
  
    totalCountDOM.innerHTML = positionsHistory.length
    averageTimeDOM.innerHTML = (getAverageByProperty(positionsHistory, 'duration') / 1000 / 60).toFixed(2) + 'min'
    averageAmountDOM.innerHTML = getAverageByProperty(positionsHistory, 'amount').toFixed(2) + '$'
    //averageProfitDOM.innerHTML = getAverageByProperty(amount)
    console.log(createDictionaryFromProperty(positionsHistory, 'symbol'))
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