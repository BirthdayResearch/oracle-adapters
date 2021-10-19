import { AbstractFilter } from '../AbstractFilter'
import { AssetPrice } from '@defichain/salmon-fetch'

/**
 * AmountFilter checks if any amount is invalid, non-positive (negative or zero), non-finite.
 * This filter rejects all assets if any amount fits a condition.
 */
export class AmountFilter extends AbstractFilter {
  async call (prices: AssetPrice[]): Promise<AssetPrice[]> {
    for (const price of prices) {
      if (isInvalid(price)) {
        this.error(`AmountFilter.isInvalid ${JSON.stringify(price)}`)
      }
    }

    return prices
  }
}

/**
 * Assets with an amount at this value or error cannot be traded and is rejected.
 *
 * @return boolean
 */
function isInvalid (price: AssetPrice): boolean {
  if (price.amount.isNegative()) {
    return true
  }

  if (price.amount.isZero()) {
    return true
  }

  return !price.amount.isFinite()
}
