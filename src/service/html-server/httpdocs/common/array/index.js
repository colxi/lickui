export function downsample(data, factor) {
  let current = 0
  const downsampled = [
    data[0],
    ...data.filter(i => {
      current++
      if (current !== factor) return null
      else {
        current = 0
        return i
      }
    })
  ]
  downsampled.push(data[data.length - 1])
  return downsampled
}
