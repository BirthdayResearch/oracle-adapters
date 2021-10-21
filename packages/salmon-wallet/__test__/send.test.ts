import waitForExpect from 'wait-for-expect'
import { JsonRpcClient } from '@defichain/jellyfish-api-jsonrpc'
import { RegTestGenesisKeys } from '@defichain/jellyfish-network'
import { WhaleMasternodeRegTestContainer } from '@defichain/salmon-testing'
import { SalmonWallet } from '@defichain/salmon-wallet'
import { BigNumber } from 'bignumber.js'
import { WhaleApiClient } from '@defichain/whale-api-client'
import { AssetPrice } from '@defichain/salmon'

const container = new WhaleMasternodeRegTestContainer()
const address = RegTestGenesisKeys[RegTestGenesisKeys.length - 1].operator
let client: JsonRpcClient
let whaleApiClient: WhaleApiClient
let oracleId: string

beforeEach(async () => {
  await container.start()
  await container.ain.waitForWalletCoinbaseMaturity()

  client = new JsonRpcClient(await container.ain.getCachedRpcUrl())
  whaleApiClient = container.getWhaleApiClient()

  await client.wallet.sendToAddress(address.address, 1)
  await container.ain.generate(1)

  const symbols = ['BTC', 'ETH', 'DOGE'].map(x => ({ token: x, currency: 'USD' }))
  oracleId = await client.oracle.appointOracle(address.address, symbols, { weightage: 1.0 })
  await container.ain.generate(1)

  const height = await client.blockchain.getBlockCount()
  await container.ain.generate(1)

  await waitForExpect(async () => {
    const blocks = await whaleApiClient.blocks.list(1)
    expect(blocks[0].height).toBeGreaterThanOrEqual(height)
  }, 30000)
})

afterEach(async () => {
  await container.stop()
})

it('should send single price', async () => {
  const wallet = new SalmonWallet(address.privKey, 'regtest', whaleApiClient)

  const prices: AssetPrice[] = [
    {
      token: 'BTC',
      amount: new BigNumber(50000),
      currency: 'USD',
      timestamp: new BigNumber(Date.now())
    }
  ]

  await wallet.send(oracleId, prices)
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
          amount: 50000,
          currency: 'USD',
          timestamp: expect.any(Number),
          token: 'BTC'
        }
      ],
      weightage: 1
    }
  )
})

it('should send multiple prices', async () => {
  const wallet = new SalmonWallet(address.privKey, 'regtest', whaleApiClient)

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

  await wallet.send(oracleId, prices)
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
          amount: 50000,
          currency: 'USD',
          timestamp: expect.any(Number),
          token: 'BTC'
        },
        {
          amount: 0.5,
          currency: 'USD',
          timestamp: expect.any(Number),
          token: 'DOGE'
        },
        {
          amount: 5000,
          currency: 'USD',
          timestamp: expect.any(Number),
          token: 'ETH'
        }
      ],
      weightage: 1
    }
  )
})

it('should fail on empty price list', async () => {
  const wallet = new SalmonWallet(address.privKey, 'regtest', whaleApiClient)

  const prices: AssetPrice[] = []

  await expect(async () => {
    await wallet.send('invalid', prices)
  }).rejects.toThrowError('SalmonWallet.send prices list is empty')
})

it('should fail on invalid oracle id', async () => {
  const wallet = new SalmonWallet(address.privKey, 'regtest', whaleApiClient)

  const prices: AssetPrice[] = [
    {
      token: 'BTC',
      amount: new BigNumber(1),
      currency: 'USD',
      timestamp: new BigNumber(Date.now())
    }
  ]

  await expect(async () => {
    await wallet.send('invalid', prices)
  }).rejects.toThrowError('ComposableBuffer.hexBEBufferLE.toBuffer invalid as length != getter().length')
})
