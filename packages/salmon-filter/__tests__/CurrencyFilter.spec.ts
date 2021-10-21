import { WhaleMasternodeRegTestContainer } from '@defichain/salmon-testing'
import { AbstractFilter } from '../src/AbstractFilter'
import BigNumber from 'bignumber.js'
import { CurrencyFilter } from '../src/filters/CurrencyFilter'

jest.spyOn(console, 'error').mockImplementation(jest.fn)

const container = new WhaleMasternodeRegTestContainer()
let filter: AbstractFilter

beforeAll(async () => {
  await container.start()

  const network = 'regtest'
  const client = container.getWhaleApiClient()
  const oracleId = '0000000000000000000000000000000000000000000000000000000000000000'
  filter = new CurrencyFilter(network, client, oracleId)
})

afterAll(async () => {
  await container.stop()
})

it('should error on empty string', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(1),
        currency: '',
        timestamp: new BigNumber('1634483733000')
      }
    ])
  }).rejects.toThrowError('CurrencyFilter.isInvalid ')
})

it('should error on string with only whitespaces', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(1),
        currency: '   ',
        timestamp: new BigNumber('1634483733000')
      }
    ])
  }).rejects.toThrowError('CurrencyFilter.isInvalid ')
})

it('should error on string not USD', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(1),
        currency: 'SGD',
        timestamp: new BigNumber('1634483733000')
      }
    ])
  }).rejects.toThrowError('CurrencyFilter.isInvalid ')
})

it('should error on USD with whitespaces (start)', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(1),
        currency: ' USD',
        timestamp: new BigNumber('1634483733000')
      }
    ])
  }).rejects.toThrowError('CurrencyFilter.isInvalid ')
})

it('should error on USD with whitespaces (end)', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(1),
        currency: 'USD ',
        timestamp: new BigNumber('1634483733000')
      }
    ])
  }).rejects.toThrowError('CurrencyFilter.isInvalid ')
})

it('should error on USD with whitespaces (start & end)', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(1),
        currency: ' USD ',
        timestamp: new BigNumber('1634483733000')
      }
    ])
  }).rejects.toThrowError('CurrencyFilter.isInvalid ')
})

it('should allow USD', async () => {
  await filter.call([
    {
      token: 'TSLA',
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
        token: 'TSLA',
        amount: new BigNumber(1),
        currency: ' ',
        timestamp: new BigNumber('1634483733000')
      }
    ])
  }).rejects.toThrowError('CurrencyFilter.isInvalid ')
})
