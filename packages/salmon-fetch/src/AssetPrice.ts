import BigNumber from 'bignumber.js'

export { BigNumber }

export interface AssetPrice {
  token: string
  amount: BigNumber
  currency: string
}

export function newAssetPrice (token: string, price: string | BigNumber, currency: string): AssetPrice {
  return {
    token: token,
    amount: BigNumber.isBigNumber(price) ? price : new BigNumber(price),
    currency: currency
  }
}
