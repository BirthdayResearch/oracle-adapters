import { AbstractFilter } from '../AbstractFilter'
import { AssetPrice } from '@defichain/salmon-fetch'

/**
 * TokenFilter checks if any tokens are invalid or undefined
 * This filter rejects all tokens if any they fit the condition.
 */
export class TokenFilter extends AbstractFilter {
  async call (prices: AssetPrice[]): Promise<AssetPrice[]> {
    for (const price of prices) {
      if (isInvalid(price)) {
        this.error(`TokenFilter.isInvalid ${JSON.stringify(price)}`)
      }
    }

    return prices
  }
}

/**
 * Assets with tokens with this value cannot be traded and will be rejected.
 *
 * @return boolean
 */
function isInvalid (price: AssetPrice): boolean {
  return price.token.trim().length === 0
}
