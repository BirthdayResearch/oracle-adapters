import { AssetPrice } from '@defichain/salmon-fetch'
import { NetworkName } from '@defichain/jellyfish-network'
import { WhaleApiClient } from '@defichain/whale-api-client'
import { NonZeroFilter } from './NonZeroFilter'

export abstract class AbstractFilter {
  constructor (
    protected readonly network: NetworkName,
    protected readonly whale: WhaleApiClient,
    protected readonly oracleId: string
  ) {
  }

  /**
   * @param {AssetPrice[]} prices to filter
   * @return AssetPrice[] filtered
   * @throws error if filter failed
   */
  abstract call (prices: AssetPrice[]): Promise<AssetPrice[]>

  log (message: string): void {
    console.log(message)
  }

  warn (message: string): void {
    console.warn(message)
  }

  error (message: string): void {
    console.error(message)
    throw new Error(message)
  }
}

export class RootFilter extends AbstractFilter {
  protected readonly filters: AbstractFilter[]

  constructor (network: NetworkName, whale: WhaleApiClient, oracleId: string) {
    super(network, whale, oracleId)
    this.filters = [
      new NonZeroFilter(network, whale, oracleId)
    ]
  }

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
