import waitForExpect from 'wait-for-expect'
import { PlaygroundRpcClient } from '@defichain/playground-api-client'
import { KeyPair } from '@defichain/jellyfish-network'

export async function setupOracle (client: PlaygroundRpcClient, owner: KeyPair, symbols: string[]): Promise<string> {
  const oracleId = await client.oracle.appointOracle(owner.address,
    symbols.map(x => ({ token: x, currency: 'USD' })), {
      weightage: 1.0
    })

  await waitForExpect(async () => {
    expect((await client.wallet.getTransaction(oracleId)).confirmations).toBeGreaterThanOrEqual(3)
  }, 10000)

  return oracleId
}
