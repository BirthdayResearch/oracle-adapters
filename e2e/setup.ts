import waitForExpect from 'wait-for-expect'
import { PlaygroundRpcClient, PlaygroundApiClient } from '@defichain/playground-api-client'
import { GenesisKeys } from '@defichain/testcontainers'

export const oracleOwner = GenesisKeys[GenesisKeys.length - 1].operator
export const rpcClient = new PlaygroundRpcClient(new PlaygroundApiClient({ url: 'http://localhost:3002' }))

export async function setupOracle (symbols: string[]): Promise<string> {
  const oracleId = await exports.rpcClient.oracle.appointOracle(exports.oracleOwner.address, [
    symbols.map(x => ({ token: x, currency: 'USD' }))
  ], {
    weightage: 1.0
  })

  await waitForExpect(async () => {
    expect((await exports.rpcClient.wallet.getTransaction(oracleId)).confirmations).toBeGreaterThanOrEqual(3)
  }, 10000)

  return oracleId
}
