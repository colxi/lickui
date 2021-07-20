
export default class List<T> extends Array<T> {
  constructor(maxLength = 5) {
    super()
    if (maxLength < 1) throw new Error('List maxLength should be grater than 1')
    this.#maxLength = maxLength
  }

  #maxLength: number

  get maxLength(): number { return this.#maxLength }

  public add(...a: T[]): void {
    this.push(...a)
    if (this.length > this.#maxLength) {
      this.splice(0, this.length - this.#maxLength)
    }
  }

  public last(): T {
    return this[this.length - 1]
  }

  public first(): T {
    return this[0]
  }

}