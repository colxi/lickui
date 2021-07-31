
/**
 * 
 * IMMUTABLE
 * 
 */

export type Immutable<T> =
  T extends (infer R)[] ? DeepReadonlyArray<R> :
  T extends Function ? T :
  T extends object ? DeepReadonlyObject<T> :
  T;

interface DeepReadonlyArray<T> extends ReadonlyArray<Immutable<T>> {
  ___?: any
}

type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: Immutable<T[P]>;
};
