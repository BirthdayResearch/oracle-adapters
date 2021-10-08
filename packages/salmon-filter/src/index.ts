import { NonPositiveFilter } from './filters/NonPositiveFilter'
import { AssetPrice } from '@defichain/salmon-fetch'
import { AbstractFilter } from './AbstractFilter'
import { NetworkName } from '@defichain/jellyfish-network'
import { WhaleApiClient } from '@defichain/whale-api-client'

/**
 * SalmonFilter orchestrates all Filter configured, it is run in the given order set in the constructor.
 */
export class SalmonFilter extends AbstractFilter {
  protected readonly filters: AbstractFilter[]

  constructor (network: NetworkName, whale: WhaleApiClient, oracleId: string) {
    super(network, whale, oracleId)
    this.filters = [
      new NonPositiveFilter(network, whale, oracleId)
    ]
  }

  /**
   * If prices are filtered and its empty, it will return an empty array.
   *
   * @param {AssetPrice[]} prices to filter through all filters
   * @throws Error when rejected
   */
  async call (prices: AssetPrice[]): Promise<AssetPrice[]> {
    if (prices.length === 0) {
      this.warn('RootFilter.call prices is empty before filtering')
      return []
    }

    for (const filter of this.filters) {
      prices = await filter.call(prices)
    }

    if (prices.length === 0) {
      this.warn('RootFilter.call prices is empty after filtering')
      return []
    }

    return prices
  }
}
