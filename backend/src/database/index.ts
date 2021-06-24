import config from '@/config'
import sqlite3 from 'sqlite3'

class Database {
  constructor() {
    this.db = new sqlite3.Database(`./db/${config.databaseName}`)
  }

  public db: sqlite3.Database

  public init(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS "datapoints"(
      id INTEGER PRIMARY KEY,
      totalBalance REAL,
      usedBalance REAL,
      usedBalancePercent REAL,
      openOrders INTEGER,
      timestamp INTEGER,
      date TEXT(10) NOT NULL
      );
    `
    const createDateIndexQuery = `
      CREATE INDEX IF NOT EXISTS "date" ON "datapoints" (
          "date"	ASC
      );
    `
    const createTimestampIndexQuery = `
      CREATE INDEX IF NOT EXISTS "timestamp" ON "datapoints" (
          "timestamp"	ASC
      );
    `
    return new Promise(resolve => {
      this.db.run(createTableQuery, err => {
        if (err) throw err
        this.db.run(createTimestampIndexQuery, err => {
          if (err) throw err
          this.db.run(createDateIndexQuery, err => {
            if (err) throw err
            resolve()
          })
        })
      })
    })
  }

  public query(sqlQuery: string): any {
    const result = this.db.run(sqlQuery)
    return result
  }

  public all(query: string): Promise<any> {
    return new Promise(resolve => {
      this.db.all(
        query,
        (err, result: any) => {
          if (err) throw err
          else resolve(result)
        }
      )
    })
  }

  public count(table: string): Promise<any> {
    return new Promise(resolve => {
      this.db.get(
        `SELECT COUNT(*) FROM ${table}`,
        (err, result: any) => {
          if (err) throw err
          else resolve(result['COUNT(*)'])
        }
      )
    })
  }
}

export default new Database()
