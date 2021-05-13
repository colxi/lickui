export default function getNormalizedDate(): string {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return month < 10
    ? `${day}-0${month}-${year}`
    : `${day}-${month}-${year}`
}
