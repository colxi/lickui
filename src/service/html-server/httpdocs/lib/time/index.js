export const TimeRange = {
  TODAY: 'TODAY',
  ALL_TIME: 'ALL_TIME',
  LAST_HOUR: 'LAST_HOUR',
  LAST_12_HOURS: 'LAST_12_HOURS',
  LAST_24_HOURS: 'LAST_24_HOURS',
  LAST_7_DAYS: 'LAST_7_DAYS',
  LAST_30_DAYS: 'LAST_30_DAYS',
  CUSTOM_RANGE: 'CUSTOM_RANGE',
}

export function timestampToDDMMYYYY() {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return month < 10 ? `${day}-0${month}-${year}` : `${day}-${month}-${year}`
}


export function getElapsedDays( startDate, endDate){
 return  Math.ceil( (endDate - startDate)  / (1000*60*60*24) )
}

export function filterByTimeRange(collection, timeRange){
  let data
  switch (timeRange) {
    case TimeRange.ALL_TIME: {
      data = collection
      break
    }
    case TimeRange.TODAY: {
      data = filterByDateRange(new Date().setHours(0, 0, 0, 0), Date.now(), collection)
      break
    }
    case TimeRange.LAST_HOUR: {
      data = filterByDateRange(Date.now() - (60 * 60 * 1000), Date.now(), collection)
      break
    }
    case TimeRange.LAST_12_HOURS: {
      data = filterByDateRange(Date.now() - (12 * 60 * 60 * 1000), Date.now(), collection)
      break
    }
    case TimeRange.LAST_24_HOURS: {
      data = filterByDateRange(Date.now() - (24 * 60 * 60 * 1000), Date.now(), collection)
      break
    }
    case TimeRange.LAST_7_DAYS: {
      data = filterByDateRange(Date.now() - (7 * 24 * 60 * 60 * 1000), Date.now(), collection)
      break
    }
    case TimeRange.LAST_30_DAYS: {
      data = filterByDateRange(Date.now() - (30 * 24 * 60 * 60 * 1000), Date.now(), collection)
      break
    }
    case TimeRange.CUSTOM_RANGE: {
      console.log('NOT IMPLEMENTED')
      break
    }
    default: {
      throw new Error('Invalid time Range')
    }
  }

  return data
}

function filterByDateRange(start, end, futuresBalanceHistory) {
  return futuresBalanceHistory.filter(a => a.timestamp > start && a.timestamp < end)
}