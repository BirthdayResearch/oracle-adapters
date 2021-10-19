import { AbstractFilter } from '../AbstractFilter'
import { AssetPrice } from '@defichain/salmon-fetch'

/**
 * CurrencyFilter checks if any currency is invalid, is an empty string, is not USD
 * This filter rejects all assets if any currency fit a condition.
 */
export class CurrencyFilter extends AbstractFilter {
  async call (prices: AssetPrice[]): Promise<AssetPrice[]> {
    for (const price of prices) {
      if (isInvalid(price)) {
        this.error(`CurrencyFilter.isInvalid ${JSON.stringify(price)}`)
      }
    }

    return prices
  }
}

/**
 * Assets with a currency of this value cannot be traded and will be rejected.
 *
 * @return boolean
 */
function isInvalid (price: AssetPrice): boolean {
  if (price.currency.trim().length === 0) {
    return true
  }

  return price.currency !== 'USD'
}
