import { AssetPrice } from '@defichain/salmon-fetch'
import { getEnv } from './Configuration'
import { SalmonWallet } from '@defichain/salmon-wallet'
import { WhaleApiClient } from '@defichain/whale-api-client'
import { NetworkName } from '@defichain/jellyfish-network'
import { RootFilter } from './filters/Filter'

/**
 * @param prices
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

  const filter = new RootFilter(network, client, oracleId)
  prices = await filter.call(prices)

  // If RootFilter return empty prices, we can safely exit.
  if (prices.length === 0) {
    return
  }

  // Else we can broadcast the prices.
  const wallet = new SalmonWallet(privateKey, network, client)
  await wallet.send(oracleId, prices)
}

