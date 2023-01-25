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
 * Helper utility to create new AssetPrice with automatic validation and conversion of types to required types.
 *
 * @param {string} token symbol of the AssetPrice (internal symbol)
 * @param {string | number | BigNumber} price in BigNumber, if string or number it will automatically be converted.
 * @param {string} currency of AssetPrice
 * @param {number | BigNumber} timestamp (milliseconds since epoch) in BigNumber, if number it will automatically be converted. If datetime is in string, Date.parse(datetime).toNumber() could be used.
 * @returns {Promise<AssetPrice>}
 *
 * @throws Error if price is not string or BigNumber
 * @throws Error if timestamp is not number or BigNumber
 */
export function newAssetPrice (token: string, price: string | number | BigNumber, currency: string, timestamp: number | BigNumber): AssetPrice {
  if (typeof token as any !== 'string') {
    throw new Error('token is not string')
  }

  if (!isPriceValid(price)) {
    throw new Error(`price for token ${token} is not string, number or BigNumber`)
  }

  if (typeof currency as any !== 'string') {
    throw new Error('currency is not string')
  }

  if (!isTimestampValid(timestamp)) {
    throw new Error('timestamp is not number or BigNumber')
  }

  return {
    token,
    amount: BigNumber.isBigNumber(price) ? price : new BigNumber(price),
    currency,
    timestamp: BigNumber.isBigNumber(timestamp) ? timestamp : new BigNumber(timestamp)
  }
}

/**
 * isPriceValid rejects price if it cannot be converted to BigNumber, or timestamp is Nan, or timestamp is not finite.
 * @param {string | number | BigNumber} price of the AssetPrice
 *
 * @return true if price is a well-formed BigNumber and not Nan or infinite
 */
function isPriceValid (price: string | number | BigNumber): boolean {
  const amount = BigNumber.isBigNumber(price) ? price : new BigNumber(price)

  if (!BigNumber.isBigNumber(amount)) {
    return false
  }

  if (amount.isNaN()) {
    return false
  }

  return amount.isFinite()
}

/**
 * isTimestampValid rejects timestamp if it cannot be converted to BigNumber, or timestamp is Nan, or timestamp is not finite.
 * @param {number | BigNumber} timestamp of the AssetPrice
 *
 * @return true if timestamp is a well-formed BigNumber and not Nan or infinite
 */
function isTimestampValid (timestamp: number | BigNumber): boolean {
  const timestampBN = BigNumber.isBigNumber(timestamp) ? timestamp : new BigNumber(timestamp)

  if (!BigNumber.isBigNumber(timestampBN)) {
    return false
  }

  if (timestampBN.isNaN()) {
    return false
  }

  return timestampBN.isFinite()
}
