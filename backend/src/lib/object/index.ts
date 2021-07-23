/**
 * 
 * Removes all object keys and returns an empty object.
 * Mutates the passed object!
 * 
 */
export function clearObject<T extends Record<string, unknown>>(o: T): T {
  for (const key of Object.keys(o)) delete o[key]
  return o
}