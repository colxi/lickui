import config from '@/core/config'
import sqlite3 from 'sqlite3'

const createDatapointsQuery = `
  CREATE TABLE IF NOT EXISTS "datapoints"(
    "id" INTEGER PRIMARY KEY,
    "totalBalance" REAL,
    "unrealizedLosts" REAL,
    "unrealizedLostsPercent" REAL,
    "usedBalance" REAL,
    "usedBalancePercent" REAL,
    "openOrders" INTEGER,
    "timestamp" INTEGER,
    "date" TEXT(10) NOT NULL
  );
`
const createDatapointsDateIndexQuery = `
  CREATE INDEX IF NOT EXISTS "date" ON "datapoints" (
    "date"	ASC
  );
`
const createDatapointdTimestampIndexQuery = `
  CREATE INDEX IF NOT EXISTS "timestamp" ON "datapoints" (
    "timestamp"	ASC
  );
`

const createPositionTableQuery = `
  CREATE TABLE IF NOT EXISTS "positions" (
    "id" INTEGER PRIMARY KEY,
    "timestamp"	INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "symbol" TEXT(10) NOT NULL,
    "amount" REAL NOT NULL,
    "size" REAL NOT NULL,
    "takeProfit" REAL NOT NULL,
    "leverage" INTEGER NOT NULL
  );
`
const createPositiondTimestampIndexQuery = `
  CREATE INDEX IF NOT EXISTS "timestamp" ON "positions" (
    "timestamp"	ASC
  );
`

class Database {
  constructor() {
    this.db = new sqlite3.Database(`./db/${config.databaseName}`)
  }

  public db: sqlite3.Database

  public init(): Promise<void> {

    return new Promise(resolve => {
      this.db.run(createDatapointsQuery, err => {
        if (err) throw err
        this.db.run(createDatapointdTimestampIndexQuery, err => {
          if (err) throw err
          this.db.run(createDatapointsDateIndexQuery, err => {
            if (err) throw err
            this.db.run(createDatapointsDateIndexQuery, err => {
              if (err) throw err
              this.db.run(createPositionTableQuery, err => {
                if (err) throw err
                this.db.run(createPositiondTimestampIndexQuery, err => {
                  if (err) throw err
                  resolve()
                })
              })
            })
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

  public resetData(table: string): Promise<any> {
    return new Promise(resolve => {
      this.db.run(
        `DELETE FROM ${table};`,
        (err: any) => {
          if (err) throw err
          else resolve({})
        }
      )
    })
  }
}

export default new Database()
