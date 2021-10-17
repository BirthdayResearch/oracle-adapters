import { AbstractFilter } from '../AbstractFilter'
import { AssetPrice } from '@defichain/salmon-fetch'

/**
 * AmountFilter checks if any prices are valid, non-positive (negative or zero).
 * This filter rejects all prices if any prices fit the condition.
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
 * Asset cannot be traded at this value, error and reject all prices.
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
