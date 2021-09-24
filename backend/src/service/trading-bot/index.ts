import { config } from '@/config'
import { clearArray } from '@/lib/array'
import { getPercentage } from '@/lib/math'
import { clearObject } from '@/lib/object'
import { sleep } from '@/lib/sleep'
import { LiquidationEvent } from '../../lib/binance-futures/futures-liquidations/types'
import fetch from 'node-fetch'
import BinanceFutures from '@/lib/binance-futures'
import { AssetName, CurrencyAmount, OrderSide } from '@/lib/binance-futures/types'

class TradingBot {
  constructor() {
    this.#liquidationsMedian24h = {}
    this.#assetPairs = []
    this.#binanceFutures = new BinanceFutures()
    this.#handleLiquidationEvent = this.#handleLiquidationEvent.bind(this)
  }

  readonly #liquidationsMedian24h: Record<AssetName, CurrencyAmount>
  readonly #assetPairs: AssetName[]
  readonly #binanceFutures: BinanceFutures

  public async start(options: { assetPairs: AssetName[] }): Promise<void> {
    clearArray(this.#assetPairs)
    clearObject(this.#liquidationsMedian24h)

    this.#assetPairs.push(...options.assetPairs)
    // start the Binance Client
    await this.#binanceFutures.start({ assetPairs: options.assetPairs })
    // set the correct leverage and marginType to assets
    await this.#initializeAssets()

    // TODO: create a service that updates the 24h liquidations data every 
    // 30 minutes, instead of this initial  fetch
    const liquidations = await this.#get24HLiquidationsData()
    for (const [assetName, liquidationsMedian] of Object.entries(liquidations)) {
      this.#liquidationsMedian24h[assetName] = liquidationsMedian
    }

    this.#binanceFutures.liquidations.subscribe(
      this.#binanceFutures.liquidations.Event.LIQUIDATION_EVENT,
      this.#handleLiquidationEvent
    )
  }

  public async stop(): Promise<void> {
    this.#binanceFutures.liquidations.unsubscribe(
      this.#binanceFutures.liquidations.Event.LIQUIDATION_EVENT,
      this.#handleLiquidationEvent
    )

    await this.#binanceFutures.stop()
  }


  #createOrUpdatePosition = async (
    assetName: AssetName,
    orderSide: OrderSide
  ): Promise<void> => {
    // 1- check if position is already open
    // 2- if its open, check dca and inject
    // 3- if not open, open the order

    // Calculate position quantity
    const percentBal = 1
    const amountToTrade = getPercentage(this.#binanceFutures.wallet.totalBalance, percentBal)
    const assetPrice = this.#binanceFutures.assets.asset[assetName].price
    const assetQuantityPrecision = this.#binanceFutures.assets.asset[assetName].quantityPrecision
    const quantityToTradeRaw = amountToTrade / assetPrice
    let quantityToTrade = Number(quantityToTradeRaw.toFixed(assetQuantityPrecision))

    if (assetQuantityPrecision === 0 && quantityToTrade === 0) {
      console.log('Warning, defaulting quantityToTrade to 1 for order :', assetName)
      quantityToTrade = 1
    }

    // OPEN the position
    console.log(`Opening position ${assetName} side=${orderSide} quantity=${quantityToTrade} (precision=${assetQuantityPrecision}, unformatted=${quantityToTradeRaw}) symbolPrice=${assetPrice}`)
    const marketOrder = await this.#binanceFutures.positions.openPosition({
      assetName: assetName,
      side: orderSide,
      quantity: quantityToTrade
    })
    // force a bit of delay to ensure the order is already available for being queried
    await sleep(500)

    // GET MARKER ORDER INFO (required for avgPrice)
    const order = await this.#binanceFutures.positions.fetchOrderByClientOrderId({
      assetName: assetName,
      clientOrderId: marketOrder.clientOrderId
    })
    console.log('position order info', order)
    process.exit()
  }

  #get24HLiquidationsData = async (): Promise<Record<AssetName, CurrencyAmount>> => {
    const liquidationsData: Record<AssetName, CurrencyAmount> = {}
    const response = await fetch('https://liquidation.wtf/api/v0/liquidations/by_coin')
    const liquidations: { data: any[] } = await response.json()
    for (const asset of liquidations.data) liquidationsData[`${asset.symbol}USDT`] = Number(asset.median_usdt)
    return liquidationsData
  }

  #initializeAssets = async (): Promise<void> => {
    // Iterate all assets and set correct leverage for those that have a wrong one
    console.log('Setting config leverage value to assets...')
    for (const assetName of this.#assetPairs) {
      const asset = this.#binanceFutures.assets.asset[assetName]
      if (asset.leverage !== config.futuresLeverage) {
        await this.#binanceFutures.assets.asset[assetName].setLeverage(config.futuresLeverage)
      }
    }
    console.log('All assets have correct leverage')
    // Iterate all assets and set correct margin type for those that have a wrong one
    console.log('Setting config margin type to assets...')
    for (const assetName of this.#assetPairs) {
      const asset = this.#binanceFutures.assets.asset[assetName]
      if (asset.marginType !== config.futuresMarginType) {
        await this.#binanceFutures.assets.asset[assetName].setMarginType(config.futuresMarginType)
      }
    }
    console.log('All assets have correct margin Type')
  }

  #handleLiquidationEvent = async (eventData: LiquidationEvent): Promise<void> => {
    const vwap = this.#binanceFutures.assets.asset[eventData.assetName].vwap
    const longOffset = config.assets[eventData.assetName].longOffset
    const shortOffset = config.assets[eventData.assetName].shortOffset
    const assetPrice = this.#binanceFutures.assets.asset[eventData.assetName].price
    const requiredLiquidationTotal = this.#liquidationsMedian24h[eventData.assetName] //config.assets[a.assetName].lickValue
    const liquidationTotal = eventData.total
    const levelToOpenShort = vwap + (vwap * (shortOffset / 100))
    const levelToOpenLong = vwap - (vwap * (longOffset / 100))
    const liquidationsSide = eventData.side
    console.log(`Liquidation symbol: ${eventData.assetName}`)
    console.log(`Liquidated size: ${liquidationTotal} USDT`)
    console.log(`Required liquidation size: ${requiredLiquidationTotal} USDT`)
    if (liquidationTotal < requiredLiquidationTotal) {
      console.log('Minimum liquidation size not met. Ignoring event')
    } else {
      console.log(`Liquidation Side: ${liquidationsSide}`)
      console.log(`Current vWAP: ${vwap} USDT`)
      console.log(`Current Price: ${assetPrice} USDT`)
      switch (liquidationsSide) {
        // Liquidations ocurred on SHORT orders
        case OrderSide.BUY: {
          console.log(`Take longs below: ${levelToOpenLong} USDT (longOffset=${longOffset}%)`)
          if (assetPrice < levelToOpenLong) await this.#createOrUpdatePosition(eventData.assetName, OrderSide.BUY)
          else console.log('Price not below required price. Ignoring')
          break
        }
        // Liquidations ocurred on LONG orders
        case OrderSide.SELL: {
          console.log(`Take shorts above: ${levelToOpenShort} USDT (shortOffset=${shortOffset}%)`)
          if (assetPrice > levelToOpenShort) await this.#createOrUpdatePosition(eventData.assetName, OrderSide.SELL)
          else console.log('Price not above required price. Ignoring')
          break
        }
      }
    }
    // console.log('Offset', config.assets[a.assetName].longOffset)
    console.log('----------')
  }
}

export default new TradingBot()
