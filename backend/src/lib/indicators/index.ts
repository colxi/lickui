import { AssetCandle } from '@/service/binance-service/futures-assets/types'

/**
 * 
 * Typical Price Indicator
 * Typical price refers to the arithmetic average of the high, low, and closing 
 * prices for a given candle
 * 
 */
export function calculateTypicalPrice(candle: AssetCandle): number {
  return (candle.high + candle.low + candle.close) / 3
}


/**
 * 
 * VWAP indicator
 * The VWAP is a trading indicator, which averages the closing prices during 
 * the given time period. At the same time, it puts emphasize on the periods 
 * with higher volume. In this manner, the Volume Weighted Average Price is 
 * a lagging indicator, because it is based on previous data.
 * Calculation : cumulative(typicalPrice * volume)/cumulative(volume)
 * 
 */
export function calculateVWAP(candles: AssetCandle[]): number {
  // generate a collection of candles, containing each candle volume and  
  // normalized price ( hight + low + close / 3 )
  const normalizedCandles: Array<{ volume: number, price: number }> = candles.map(candle => {
    const typicalPrice = calculateTypicalPrice(candle)
    return { volume: candle.volume, price: typicalPrice }
  })

  // calculate VWAP
  const cumulativePricePerVolume = normalizedCandles.reduce((acc, candle) => acc + (candle.volume * candle.price), 0)
  const cumulativeVolume = normalizedCandles.reduce((acc, candle) => acc + candle.volume, 0) || 0
  const vwap = cumulativePricePerVolume / cumulativeVolume

  // done!
  return vwap
}
