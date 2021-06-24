export function dateAsDDMMYYYY(dateOrTimestamp: Date | number = new Date()): string {
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
