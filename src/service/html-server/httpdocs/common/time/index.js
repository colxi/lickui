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