import BigNumber from 'bignumber.js'

export { BigNumber }

/**
 * AssetPrice containing token-amount pair and the currency that represent the pair.
 */
export interface AssetPrice {
  token: string
  amount: BigNumber
  currency: string
  timestamp: BigNumber
}

/**
 * Helper utility to create new AssetPrice with automatic conversion of types to required types.
 *
 * @param {string} token symbol of the AssetPrice (internal symbol)
 * @param {string | number | BigNumber} price in BigNumber, if string or number it will automatically be converted.
 * @param {string} currency of AssetPrice
 * @param {number | BigNumber} timestamp (seconds) in BigNumber, if number it will automatically be converted. If datetime is in string, Date.parse(datetime).toNumber() could be used.
 *
 * @throws Error if price is not string or BigNumber
 * @throws Error if timestamp is not number or BigNumber
 */
export function newAssetPrice (token: string, price: string | number | BigNumber, currency: string, timestamp: number | BigNumber): AssetPrice {
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

function isPriceValid (price: string | number | BigNumber): boolean {
  const amount = BigNumber.isBigNumber(price) ? price : new BigNumber(price)
  if (BigNumber.isBigNumber(amount)) {
    if (!amount.isNaN() && amount.isFinite()) {
      return true
    }
  }
  return false
}

function isTimestampValid (timestamp: number | BigNumber): boolean {
  const timestampBN = BigNumber.isBigNumber(timestamp) ? timestamp : new BigNumber(timestamp)
  if (BigNumber.isBigNumber(timestampBN)) {
    if (!timestampBN.isNaN() && timestampBN.isFinite()) {
      return true
    }
  }
  return false
}
