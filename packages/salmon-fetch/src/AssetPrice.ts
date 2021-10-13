import BigNumber from 'bignumber.js'
import { Fetch, isPriceValid, isTimestampValid } from './Fetch'

/**
 * Helper utility to create new AssetPrice.
 *
 * @param {string} token symbol of the AssetPrice (internal symbol)
 * @param {string | number | BigNumber} price in BigNumber, if string or number it will automatically be converted.
 * @param {string} currency of AssetPrice
 * @param {BigNumber} timestamp (seconds) in BigNumber, if number it will automatically be converted.
 *
 * @throws Error if price is not string or BigNumber
 * @throws Error if timestamp is not number or BigNumber
 */
export function newAssetPrice (token: string, price: string | number | BigNumber, currency: string, timestamp: number | BigNumber): Fetch {
  if (!isPriceValid(price)) {
    throw new Error('price is not string, number of BigNumber')
  }

  if (!isTimestampValid(timestamp)) {
    throw new Error('timestamp is not number or BigNumber')
  }

  return {
    token: token,
    amount: BigNumber.isBigNumber(price) ? price : new BigNumber(price),
    currency: currency,
    timestamp: BigNumber.isBigNumber(timestamp) ? timestamp : new BigNumber(timestamp)
  }
}
