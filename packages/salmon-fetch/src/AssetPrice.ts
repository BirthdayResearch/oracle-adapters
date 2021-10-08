import BigNumber from 'bignumber.js'

export { BigNumber }

/**
 * AssetPrice containing token-amount pair and the currency that represent the pair.
 */
export interface AssetPrice {
  token: string
  amount: BigNumber
  currency: string
}

/**
 * Helper utility to create new AssetPrice.
 *
 * @param {string} token symbol of the AssetPrice (internal symbol)
 * @param {string | BigNumber} price in BigNumber, if string it will automatically be converted.
 * @param {string} currency of AssetPrice
 *
 * @throws Error if price is not string or BigNumber
 */
export function newAssetPrice (token: string, price: string | BigNumber, currency: string): AssetPrice {
  if (!(BigNumber.isBigNumber(price) || typeof price === 'string')) {
    throw new Error('price is not string or BigNumber')
  }

  return {
    token: token,
    amount: BigNumber.isBigNumber(price) ? price : new BigNumber(price),
    currency: currency
  }
}
