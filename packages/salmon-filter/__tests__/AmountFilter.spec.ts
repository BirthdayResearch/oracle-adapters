import { AmountFilter } from '../src/filters/AmountFilter'
import { WhaleMasternodeRegTestContainer } from '@defichain/salmon-testing'
import { AbstractFilter } from '../src/AbstractFilter'
import BigNumber from 'bignumber.js'

jest.spyOn(console, 'error').mockImplementation(jest.fn)

const container = new WhaleMasternodeRegTestContainer()
let filter: AbstractFilter

beforeAll(async () => {
  await container.start()

  const network = 'regtest'
  const client = container.getWhaleApiClient()
  const oracleId = '0000000000000000000000000000000000000000000000000000000000000000'
  filter = new AmountFilter(network, client, oracleId)
})

afterAll(async () => {
  await container.stop()
})

it('should error on NaN', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(NaN),
        currency: 'USD',
        timestamp: new BigNumber('1634483733000')
      }
    ])
  }).rejects.toThrowError('AmountFilter.isInvalid ')
})

it('should error on Infinity', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(Infinity),
        currency: 'USD',
        timestamp: new BigNumber('1634483733000')
      }
    ])
  }).rejects.toThrowError('AmountFilter.isInvalid ')
})

it('should error on -Infinity', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(-Infinity),
        currency: 'USD',
        timestamp: new BigNumber('1634483733000')
      }
    ])
  }).rejects.toThrowError('AmountFilter.isInvalid ')
})

it('should error on -1', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(-1),
        currency: 'USD',
        timestamp: new BigNumber('1634483733000')
      }
    ])
  }).rejects.toThrowError('AmountFilter.isInvalid ')
})

it('should error on Zero', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber('0.0'),
        currency: 'USD',
        timestamp: new BigNumber('1634483733000')
      }
    ])
  }).rejects.toThrowError('AmountFilter.isInvalid ')
})

it('should allow 123.4', async () => {
  await filter.call([
    {
      token: 'TSLA',
      amount: new BigNumber('123.4'),
      currency: 'USD',
      timestamp: new BigNumber('1634483733000')
    }
  ])
})

it('should allow 1', async () => {
  await filter.call([
    {
      token: 'TSLA',
      amount: new BigNumber('1'),
      currency: 'USD',
      timestamp: new BigNumber('1634483733000')
    }
  ])
})

it('should allow 0.00000123', async () => {
  await filter.call([
    {
      token: 'TSLA',
      amount: new BigNumber('0.00000123'),
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
        amount: new BigNumber('0.00000123'),
        currency: 'USD',
        timestamp: new BigNumber('1634483733000')
      },
      {
        token: 'TSLA',
        amount: new BigNumber('-1'),
        currency: 'USD',
        timestamp: new BigNumber('1634483733000')
      }
    ])
  }).rejects.toThrowError('AmountFilter.isInvalid ')
})
