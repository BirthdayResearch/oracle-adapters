import { AbstractFilter } from '../AbstractFilter'
import { AssetPrice } from '@defichain/salmon-fetch'
import BigNumber from 'bignumber.js'

/**
 * TimestampFilter checks if any timestamp is invalid, is older than 3 weeks, is more than 3 weeks in to the future
 * This filter rejects all assets if any timestamp fit a condition.
 */
export class TimestampFilter extends AbstractFilter {
  async call (prices: AssetPrice[]): Promise<AssetPrice[]> {
    for (const price of prices) {
      if (isInvalid(price)) {
        this.error(`TimestampFilter.isInvalid ${JSON.stringify(price)}`)
      }
    }

    return prices
  }
}

/**
 * Assets with a timestamp of this value cannot be traded and will be rejected.
 *
 * @return boolean
 */
function isInvalid (price: AssetPrice): boolean {
  const maxAge = new BigNumber(1000 * 60 * 60 * 24 * 7 * 3) // 3 Weeks
  const minAge = new BigNumber(1000 * 60 * 60 * 24 * 7 * 3).negated() // 3 Weeks
  const currentTimestamp = new BigNumber(Date.now())

  if (price.timestamp.isNegative()) {
    return true
  }

  if (price.timestamp.isZero()) {
    return true
  }

  if (!price.timestamp.isFinite()) {
    return true
  }

  // Past
  if (!currentTimestamp.minus(price.timestamp).isLessThanOrEqualTo(maxAge)) {
    return true
  }

  // Future
  return !currentTimestamp.minus(price.timestamp).isGreaterThanOrEqualTo(minAge)
}
