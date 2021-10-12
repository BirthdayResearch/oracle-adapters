/* eslint-disable  @typescript-eslint/no-var-requires */
import waitForExpect from 'wait-for-expect'
import { oracleOwner, rpcClient, setupOracle } from './setup'
import { Salmon, SalmonWallet, WhaleApiClient } from '@defichain/salmon'
import coingecko from '../adapters/src/coingecko'

describe('e2e single coingecko', () => {
  it('should run finnhubb provider lambda function', async () => {
    const txid = await rpcClient.wallet.sendToAddress(oracleOwner.address, 1)
    await waitForExpect(async () => {
      const confirms = (await rpcClient.wallet.getTransaction(txid)).confirmations
      expect(confirms).toBeGreaterThanOrEqual(2)
    }, 10000)

    const oracleId = await setupOracle()

    const client = new WhaleApiClient({ url: 'http://localhost:3001', network: 'regtest', version: 'v0' })
    const wallet = new SalmonWallet(oracleOwner.privKey, 'regtest', client)
    const salmon = new Salmon(oracleId, 'regtest', client, wallet)
    await salmon.publish(await coingecko(['BTC', 'ETH', 'DOGE']))

    await waitForExpect(async () => {
      expect(
        (await rpcClient.oracle.getOracleData(oracleId)).tokenPrices.length
      ).toBeGreaterThanOrEqual(3)
    }, 10000)

    const oracleData = await rpcClient.oracle.getOracleData(oracleId)
    expect(oracleData.tokenPrices[0].amount).toStrictEqual(120)
    expect(oracleData.tokenPrices[1].amount).toStrictEqual(330)
    expect(oracleData.tokenPrices[2].amount).toStrictEqual(605)
  })
})
