import { WhaleMasternodeRegTestContainer } from '@defichain/salmon-testing'
import { AbstractFilter } from '../src/AbstractFilter'
import BigNumber from 'bignumber.js'
import { TokenFilter } from '../src/filters/TokenFilter'

const container = new WhaleMasternodeRegTestContainer()
let filter: AbstractFilter

beforeAll(async () => {
  await container.start()

  const network = 'regtest'
  const client = container.getWhaleApiClient()
  const oracleId = '0000000000000000000000000000000000000000000000000000000000000000'
  filter = new TokenFilter(network, client, oracleId)
})

afterAll(async () => {
  await container.stop()
})

it('should error on empty string', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: '',
        amount: new BigNumber(1),
        currency: 'USD',
        timestamp: new BigNumber('1634483733000')
      }
    ])
  }).rejects.toThrowError('TokenFilter.isInvalid ')
})

it('should error on string with only whitespaces', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: '     ',
        amount: new BigNumber(1),
        currency: 'USD',
        timestamp: new BigNumber('1634483733000')
      }
    ])
  }).rejects.toThrowError('TokenFilter.isInvalid ')
})

it('should allow TSLA', async () => {
  await filter.call([
    {
      token: 'TSLA',
      amount: new BigNumber(1),
      currency: 'USD',
      timestamp: new BigNumber('1634483733000')
    }
  ])
})

it('should allow 123', async () => {
  await filter.call([
    {
      token: '123',
      amount: new BigNumber(1),
      currency: 'USD',
      timestamp: new BigNumber('1634483733000')
    }
  ])
})

it('should allow T$LA', async () => {
  await filter.call([
    {
      token: 'T$LA',
      amount: new BigNumber(1),
      currency: 'USD',
      timestamp: new BigNumber('1634483733000')
    }
  ])
})

it('should error and fail if one is invalid', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(1),
        currency: 'USD',
        timestamp: new BigNumber('1634483733000')
      },
      {
        token: '',
        amount: new BigNumber(1),
        currency: 'USD',
        timestamp: new BigNumber('1634483733000')
      }
    ])
  }).rejects.toThrowError('TokenFilter.isInvalid ')
})
