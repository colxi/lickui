export const TimeRange = {
  TODAY: 'TODAY',
  CURRENT_MONTH: 'CURRENT_MONTH',
  ALL_TIME: 'ALL_TIME',
  LAST_HOUR: 'LAST_HOUR',
  LAST_12_HOURS: 'LAST_12_HOURS',
  LAST_24_HOURS: 'LAST_24_HOURS',
  LAST_7_DAYS: 'LAST_7_DAYS',
  LAST_30_DAYS: 'LAST_30_DAYS',
  //CUSTOM_RANGE: 'CUSTOM_RANGE',
}

export function timestampToDDMMYYYY(t = Date.now()) {
  const date = new Date(t)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return month < 10 ? `${day}-0${month}-${year}` : `${day}-${month}-${year}`
}


export function getElapsedDays(startDate, endDate) {
  return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
}

export function getDaysInMonth(month, year = new Date().getFullYear()) {
  return new Date(year, month, 0).getDate();
}

export function getTimeRangeStartDate(timeRange) {
  const now = new Date()
  switch (timeRange) {
    case TimeRange.ALL_TIME:
      {
        return 0
      }
    case TimeRange.TODAY:
      {
        return new Date().setHours(0, 0, 0, 0)
      }
    case TimeRange.CURRENT_MONTH:
      {
        return new Date(now.getFullYear(), now.getMonth(), 1).getTime()
      }
    case TimeRange.LAST_HOUR:
      {
        return Date.now() - (60 * 60 * 1000)
      }
    case TimeRange.LAST_12_HOURS:
      {
        return Date.now() - (12 * 60 * 60 * 1000)
      }
    case TimeRange.LAST_24_HOURS:
      {
        return Date.now() - (24 * 60 * 60 * 1000)
      }
    case TimeRange.LAST_7_DAYS:
      {
        return Date.now() - (7 * 24 * 60 * 60 * 1000)
      }
    case TimeRange.LAST_30_DAYS:
      {
        return Date.now() - (30 * 24 * 60 * 60 * 1000)
      }
      //case TimeRange.CUSTOM_RANGE: {
      //  console.log('NOT IMPLEMENTED')
      //  break
      //}
    default:
      {
        throw new Error('Invalid time Range')
      }
  }
}

export function filterByTimeRange(collection, timeRange) {
  const startDate = getTimeRangeStartDate(timeRange)
  return filterByDateRange(
    startDate,
    Date.now(),
    collection
  )
}

function filterByDateRange(start, end, futuresBalanceHistory) {
  return futuresBalanceHistory.filter(a => a.timestamp > start && a.timestamp < end)
}