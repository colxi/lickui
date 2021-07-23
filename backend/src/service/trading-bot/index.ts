import { config } from '@/config'
import { clearArray } from '@/lib/array'
import { clearObject } from '@/lib/object'
import { AssetName, CurrencyAmount, OrderSide } from '@/types'
import fetch from 'node-fetch'
import BinanceService from '../binance-service'
import { LiquidationEvent } from '../binance-service/futures-liquidations/types'

class TradingBot {
  constructor() {
    this.#liquidationsMedian = {}
    this.#assetPairs = []
  }

  readonly #liquidationsMedian: Record<AssetName, CurrencyAmount>
  readonly #assetPairs: AssetName[]

  #get24HLiquidationsData = async (): Promise<Record<AssetName, CurrencyAmount>> => {
    const liquidationsData: Record<AssetName, CurrencyAmount> = {}
    const response = await fetch('https://liquidation.wtf/api/v0/liquidations/by_coin')
    const liquidations: { data: any[] } = await response.json()
    for (const asset of liquidations.data) liquidationsData[`${asset.symbol}USDT`] = Number(asset.median_usdt)
    return liquidationsData
  }

  #handleLiquidationEvent = (eventData: LiquidationEvent): void => {
    const vwap = BinanceService.assets.asset[eventData.assetName].vwap
    const longOffset = config.assets[eventData.assetName].longOffset
    const shortOffset = config.assets[eventData.assetName].shortOffset
    const assetPrice = BinanceService.assets.asset[eventData.assetName].price
    const requiredLiquidationTotal = this.#liquidationsMedian[eventData.assetName] //config.assets[a.assetName].lickValue
    const liquidationTotal = eventData.total
    const levelToOpenShort = vwap + (vwap * (shortOffset / 100))
    const levelToOpenLong = vwap - (vwap * (longOffset / 100))
    const liquidationsSide = eventData.side
    console.log(`Liquidation symbol: ${eventData.assetName}`)
    console.log(`Liquidated size: ${liquidationTotal} USDT`)
    console.log(`Required liquidation size: ${requiredLiquidationTotal} USDT`)
    if (liquidationTotal < requiredLiquidationTotal) {
      console.log('Minimum liquidation size not meet. Ignoring event')
    } else {
      console.log(`Liquidation Side: ${liquidationsSide}`)
      console.log(`Current vWAP: ${vwap} USDT`)
      console.log(`Current Price: ${assetPrice} USDT`)
      switch (liquidationsSide) {
        // Liquidations ocurred on SHORT orders
        case OrderSide.BUY: {
          console.log(`Take longs below: ${levelToOpenLong} USDT (longOffset=${longOffset}%)`)
          if (assetPrice < levelToOpenLong) console.log('Opening LONG!')
          else console.log('Price not below required price. Ignoring')
          break
        }
        // Liquidations ocurred on LONG orders
        case OrderSide.SELL: {
          console.log(`Take shorts above: ${levelToOpenShort} USDT (shortOffset=${shortOffset}%)`)
          if (assetPrice > levelToOpenShort) console.log('Opening SHORT!')
          else console.log('Price not above required price. Ignoring')
          break
        }
      }

    }
    // console.log('Offset', config.assets[a.assetName].longOffset)
    console.log('----------')
  }

  async start(options: { assetPairs: AssetName[] }): Promise<void> {
    clearArray(this.#assetPairs)
    this.#assetPairs.push(...options.assetPairs)
    clearObject(this.#liquidationsMedian)
    const liquidations = await this.#get24HLiquidationsData()
    for (const [assetName, liquidationsMedian] of Object.entries(liquidations)) {
      this.#liquidationsMedian[assetName] = liquidationsMedian
    }

    // TODO: validate all assetPairs are present in the get24HLiquidationsData response

    await BinanceService.start({ assetPairs: options.assetPairs })

    BinanceService.liquidations.subscribe(
      BinanceService.liquidations.Event.LIQUIDATION_EVENT,
      (eventData) => this.#handleLiquidationEvent(eventData)
    )
  }

}

export default new TradingBot()
