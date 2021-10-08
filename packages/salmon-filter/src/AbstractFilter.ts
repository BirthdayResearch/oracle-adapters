import { AssetPrice } from '@defichain/salmon-fetch'
import { NetworkName } from '@defichain/jellyfish-network'
import { WhaleApiClient } from '@defichain/whale-api-client'

/**
 * AbstractFilter using a chain of responsibility design pattern.
 *
 * Configured with network, whale client and oracleId. This filter pattern receive a list of prices for filtering.
 * Once filtered, it can accept, warn, reject partial by filtering or rejecting all.
 *
 * Orchestrated via SalmonFilter and configured to run in the given order.
 *
 * @see SalmonFilter
 */
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

  /**
   * Purely for logging purposes.
   * @param {string} message to log
   */
  log (message: string): void {
    console.log(message)
  }

  /**
   * Simply warn or to reject some price feed without rejecting all.
   * @param {string} message to warn
   */
  warn (message: string): void {
    console.warn(message)
  }

  /**
   * To be used for rejecting a prices feed completely.
   * @param {string} message to throw and exit immediately
   * @throws Error
   */
  error (message: string): void {
    console.error(message)
    throw new Error(message)
  }
}
