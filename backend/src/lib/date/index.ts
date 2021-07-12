export function getDateAsDDMMYYYY(dateOrTimestamp: Date | number = new Date()): string {
  const date = (typeof dateOrTimestamp === 'number')
    ? new Date(dateOrTimestamp)
    : dateOrTimestamp
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return month < 10
    ? `${day}-0${month}-${year}`
    : `${day}-${month}-${year}`
}


export enum TimeInMillis {
  ONE_HOUR = (1000 * 60 * 60),
  TWO_HOURS = (1000 * 60 * 60 * 2),
  FIVE_HOURS = (1000 * 60 * 60 * 5),
  ONE_DAY = (1000 * 60 * 60 * 24),
  TWO_DAYS = (1000 * 60 * 60 * 24 * 2),
  FIVE_DAYS = (1000 * 60 * 60 * 24 * 5),
  ONE_WEEK = (1000 * 60 * 60 * 24 * 7),
  ONE_MONTH = (1000 * 60 * 60 * 24 * 30),
}