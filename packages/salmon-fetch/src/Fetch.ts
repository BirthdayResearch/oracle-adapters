import BigNumber from 'bignumber.js'

/**
 * AssetPrice containing token-amount pair and the currency that represent the pair.
 */
export interface Fetch {
  token: string
  amount: BigNumber
  currency: string
  timestamp: BigNumber
}

export function isPriceValid (price: string | number | BigNumber): boolean {
  const amount = BigNumber.isBigNumber(price) ? price : new BigNumber(price)
  if (BigNumber.isBigNumber(amount)) {
    if (!amount.isNaN() && amount.isFinite()) {
      return true
    }
  }
  return false
}

export function isTimestampValid (timestamp: number | BigNumber): boolean {
  const timestampBN = BigNumber.isBigNumber(timestamp) ? timestamp : new BigNumber(timestamp)
  if (BigNumber.isBigNumber(timestampBN)) {
    if (!timestampBN.isNaN() && timestampBN.isFinite()) {
      return true
    }
  }
  return false
}
