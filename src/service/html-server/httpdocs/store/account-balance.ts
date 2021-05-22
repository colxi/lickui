// @ts-ignore TS6133
import { BalanceHistoryEntry } from '../types'

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