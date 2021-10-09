import { NetworkName } from '@defichain/jellyfish-network'
import { WhaleApiClient } from '@defichain/whale-api-client'
import { AssetPrice } from '@defichain/salmon-fetch'
import { SalmonFilter } from '@defichain/salmon-filter'
import { SalmonWallet } from '@defichain/salmon-wallet'

export * from '@defichain/salmon-fetch'
export * from '@defichain/salmon-filter'
export * from '@defichain/salmon-wallet'
export * from '@defichain/whale-api-client'

/**
 * A modular PriceFeed publisher to push prices through a filter and publish it into SalmonWallet.
 *
 * 0. Prior - fetch the price feed from an adapter and pushes it to a Salmon instance.
 * 1. Setup - reads the env configs, initialize the instances and client.
 * 2. Filter - reads the price feed data and decide whether to alter, accept or reject it.
 * 3. Publish - finally broadcast the accepted prices' data.
 *
 * @example
 * import getPrices from 'coingecko'
 * import { Salmon } from '@defichain/salmon'
 *
 * const client = new WhaleApiClient()
 * const wallet = new SalmonWallet()
 * const salmon = new Salmon('oracleId', 'mainnet', client, wallet)
 *
 * await salmon.publish(await getPrices())
 */
export class Salmon {
  constructor (
    private readonly oracleId: string,
    private readonly network: NetworkName,
    private readonly client: WhaleApiClient,
    private readonly wallet: SalmonWallet,
    private readonly filter: SalmonFilter = new SalmonFilter(network, client, oracleId)
  ) {
  }

  /**
   * @param {AssetPrice} prices to push
   * @return {string | undefined} txid if successfully published
   */
  async publish (prices: AssetPrice[]): Promise<string | undefined> {
    prices = await this.filter.call(prices)

    // If RootFilter return empty prices, we can safely exit.
    if (prices.length === 0) {
      return
    }

    // Else we can broadcast the prices.
    return await this.wallet.send(this.oracleId, prices)
  }
}
