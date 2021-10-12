/* eslint-disable  @typescript-eslint/no-var-requires */
import waitForExpect from 'wait-for-expect'
import { oracleOwner, rpcClient, setupOracle } from './setup'
import { Salmon, SalmonWallet, WhaleApiClient } from '@defichain/salmon'
import coingecko from '../adapters/src/coingecko'

describe('e2e single coingecko', () => {
  it('should run coingecko salmon runner', async () => {
    const txid = await rpcClient.wallet.sendToAddress(oracleOwner.address, 1)
    await waitForExpect(async () => {
      const confirms = (await rpcClient.wallet.getTransaction(txid)).confirmations
      expect(confirms).toBeGreaterThanOrEqual(2)
    }, 10000)

    const oracleId = await setupOracle(['BTC', 'ETH', 'DOGE'])

    const client = new WhaleApiClient({ url: 'http://localhost:3001', network: 'regtest', version: 'v0' })
    const wallet = new SalmonWallet(oracleOwner.privKey, 'regtest', client)
    const salmon = new Salmon(oracleId, 'regtest', client, wallet)
    const coingeckoPrices = await coingecko(['BTC', 'ETH', 'DOGE'])
    await salmon.publish(coingeckoPrices)

    await waitForExpect(async () => {
      expect(
        (await rpcClient.oracle.getOracleData(oracleId)).tokenPrices.length
      ).toBeGreaterThanOrEqual(3)
    }, 10000)

    const oracleData = await rpcClient.oracle.getOracleData(oracleId)
    expect(oracleData).toStrictEqual(
      {
        address: '0014e0dc4bafbea4d48f538ae526d8143a7159a510ee',
        oracleid: oracleId,
        priceFeeds: [
          {
            currency: 'USD',
            token: 'BTC'
          },
          {
            currency: 'USD',
            token: 'DOGE'
          },
          {
            currency: 'USD',
            token: 'ETH'
          }
        ],
        tokenPrices: [
          {
            amount: coingeckoPrices[0].amount.toNumber(),
            currency: 'USD',
            timestamp: expect.any(Number),
            token: 'BTC'
          },
          {
            amount: coingeckoPrices[2].amount.toNumber(),
            currency: 'USD',
            timestamp: expect.any(Number),
            token: 'DOGE'
          },
          {
            amount: coingeckoPrices[1].amount.toNumber(),
            currency: 'USD',
            timestamp: expect.any(Number),
            token: 'ETH'
          }
        ],
        weightage: 1
      }
    )
  })
})
