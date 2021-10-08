import { NetworkName } from '@defichain/jellyfish-network'
import { WhaleApiClient } from '@defichain/whale-api-client'
import { AssetPrice } from '@defichain/salmon-fetch'
import { SalmonFilter } from '@defichain/salmon-filter'
import { SalmonWallet } from '@defichain/salmon-wallet'
import { getEnv } from './Env'

/**
 * SalmonRunner to run the prices through a filter and pushes it into SalmonWallet.
 *
 * There are 3 lifecycle of SalmonRunner; setup, filter and publish.
 * Additionally, prior to running SalmonRunner you fetch the price feed from an adapter and pushes it to SalmonRunner.
 *
 * 1. Setup reads the env configs, initialize the instances and client.
 * 2. Filter reads the price feed data and decide whether to alter, accept or reject it.
 * 3. Publish finally broadcast the accepted prices data.
 *
 * @example
 * import getPrices from 'coingecko'
 * import { push } from '@defichain/salmon-runner'
 *
 * await push(await getPrices())
 *
 * @param {AssetPrice} prices to push
 */
export async function push (prices: AssetPrice[]): Promise<void> {
  const network = getEnv<NetworkName>('NETWORK', v => ['mainnet', 'testnet', 'regtest'].includes(v))
  const whaleUrl = getEnv('WHALE_URL')
  const oracleId = getEnv('ORACLE_ID')
  const privateKey = getEnv('WIF_PRIVATE_KEY')

  const client = new WhaleApiClient({
    url: whaleUrl,
    version: 'v0',
    network: network
  })

  const filter = new SalmonFilter(network, client, oracleId)
  prices = await filter.call(prices)

  // If RootFilter return empty prices, we can safely exit.
  if (prices.length === 0) {
    return
  }

  // Else we can broadcast the prices.
  const wallet = new SalmonWallet(privateKey, network, client)
  await wallet.send(oracleId, prices)
}
