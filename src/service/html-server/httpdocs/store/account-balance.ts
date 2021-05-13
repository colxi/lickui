// @ts-ignore TS6133
import { BalanceHistoryEntry } from '../types'
import creteTimeRangeSelector from './time-range-selector.ts'

interface StoreState {
  balanceHistory: BalanceHistoryEntry[]
}

export default class {
  #state: StoreState = {
    balanceHistory: []
  }

  get balanceHistory(): BalanceHistoryEntry[] { return this.#state.balanceHistory }

  async setBalanceHistoryData(data: BalanceHistoryEntry[]): Promise<void> {
    this.#state.balanceHistory.push(...data)
  }

} 