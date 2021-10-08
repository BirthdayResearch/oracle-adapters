import { AbstractFilter } from '../AbstractFilter'
import { AssetPrice } from '@defichain/salmon-fetch'

/**
 * NonPositiveFilter checks if any prices are non-positive (negative or zero).
 * This filter rejects all prices if any prices fit the condition.
 */
export class NonPositiveFilter extends AbstractFilter {
  async call (prices: AssetPrice[]): Promise<AssetPrice[]> {
    for (const price of prices) {
      if (price.amount.isNegative() || price.amount.isZero()) {
        this.error(`NonPositiveFilter: ${JSON.stringify(price)}`)
      }
    }

    return prices
  }
}
