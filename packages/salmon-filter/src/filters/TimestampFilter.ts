import { AbstractFilter } from '../AbstractFilter'
import { AssetPrice } from '@defichain/salmon-fetch'
import BigNumber from 'bignumber.js'
import { NetworkName } from '@defichain/jellyfish-network'
import { WhaleApiClient } from '@defichain/whale-api-client'

export interface TimestampFilterOptions {
  maxAge?: BigNumber
  minAge?: BigNumber
}

/**
 * TimestampFilter checks if any timestamp is invalid, is older than 3 weeks, is more than 1 hour in to the future
 * This filter rejects all assets if any timestamp fit a condition.
 */
export class TimestampFilter extends AbstractFilter {
  maxAge = new BigNumber(1000 * 60 * 60 * 24 * 7 * 3) // 3 weeks
  minAge = new BigNumber(1000 * 60 * 60).negated() // 1 hour

  constructor (
    protected readonly network: NetworkName,
    protected readonly whale: WhaleApiClient,
    protected readonly oracleId: string,
    options?: TimestampFilterOptions
  ) {
    super(network, whale, oracleId)
    this.maxAge = options?.maxAge ?? this.maxAge
    this.minAge = options?.minAge ?? this.minAge
  }

  async call (prices: AssetPrice[]): Promise<AssetPrice[]> {
    for (const price of prices) {
      if (isInvalid(price, this.maxAge, this.minAge)) {
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
function isInvalid (price: AssetPrice, maxAge: BigNumber, minAge: BigNumber): boolean {
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
