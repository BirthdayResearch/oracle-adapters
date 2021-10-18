import { JsonRpcClient } from '@defichain/jellyfish-api-jsonrpc'
import { GenesisKeys } from '@defichain/testcontainers'
import { WhaleMasternodeRegTestContainer } from '@defichain/salmon-testing'
import { SalmonWallet } from '@defichain/salmon-wallet'
import { AssetPrice, BigNumber, Salmon, WhaleApiClient } from '../src'

const container = new WhaleMasternodeRegTestContainer()
let client: JsonRpcClient
let whaleApiClient: WhaleApiClient

beforeEach(async () => {
  await container.start()
  await container.ain.waitForWalletCoinbaseMaturity()
  client = new JsonRpcClient(await container.ain.getCachedRpcUrl())
  whaleApiClient = container.getWhaleApiClient()
})

afterEach(async () => {
  await container.stop()
})

it('should publish prices', async () => {
  const address = GenesisKeys[GenesisKeys.length - 1].operator
  const oracleId = await client.oracle.appointOracle(address.address,
    ['BTC', 'ETH', 'DOGE'].map(x => ({ token: x, currency: 'USD' })), {
      weightage: 1.0
    })
  await container.ain.generate(1)

  const wallet = new SalmonWallet(address.privKey, 'regtest', whaleApiClient)
  const salmon = new Salmon(oracleId, 'regtest', whaleApiClient, wallet)

  const prices: AssetPrice[] = [
    {
      token: 'BTC',
      amount: new BigNumber(50000),
      currency: 'USD',
      timestamp: new BigNumber(Date.now())
    },
    {
      token: 'ETH',
      amount: new BigNumber(5000),
      currency: 'USD',
      timestamp: new BigNumber(Date.now())
    },
    {
      token: 'DOGE',
      amount: new BigNumber(0.5),
      currency: 'USD',
      timestamp: new BigNumber(Date.now())
    }
  ]

  await salmon.publish(prices)
  await container.ain.generate(1)

  const oracleData = await client.oracle.getOracleData(oracleId)
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
          amount: prices[0].amount.toNumber(),
          currency: 'USD',
          timestamp: expect.any(Number),
          token: 'BTC'
        },
        {
          amount: prices[2].amount.toNumber(),
          currency: 'USD',
          timestamp: expect.any(Number),
          token: 'DOGE'
        },
        {
          amount: prices[1].amount.toNumber(),
          currency: 'USD',
          timestamp: expect.any(Number),
          token: 'ETH'
        }
      ],
      weightage: 1
    }
  )
})
