/**
 * 
 * Clears the provided array and returns it empty.
 * Mutates the provided array!
 * 
 */
export function clearArray<T extends any[]>(a: T): T {
  a.splice(0, a.length)
  return a
}