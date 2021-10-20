import { WhaleMasternodeRegTestContainer } from '@defichain/salmon-testing'
import { AbstractFilter } from '../src/AbstractFilter'
import BigNumber from 'bignumber.js'
import { TimestampFilter } from '../src/filters/TimestampFilter'

const container = new WhaleMasternodeRegTestContainer()
let filter: AbstractFilter

beforeAll(async () => {
  await container.start()

  const network = 'regtest'
  const client = container.getWhaleApiClient()
  const oracleId = '0000000000000000000000000000000000000000000000000000000000000000'
  filter = new TimestampFilter(network, client, oracleId)
})

afterAll(async () => {
  await container.stop()
})

it('should error on NaN', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(1),
        currency: 'USD',
        timestamp: new BigNumber(NaN)
      }
    ])
  }).rejects.toThrowError('TimestampFilter.isInvalid ')
})

it('should error on Infinity', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(1),
        currency: 'USD',
        timestamp: new BigNumber(Infinity)
      }
    ])
  }).rejects.toThrowError('TimestampFilter.isInvalid ')
})

it('should error on -Infinity', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(1),
        currency: 'USD',
        timestamp: new BigNumber(-Infinity)
      }
    ])
  }).rejects.toThrowError('TimestampFilter.isInvalid ')
})

it('should error on -1', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(1),
        currency: 'USD',
        timestamp: new BigNumber(-1)
      }
    ])
  }).rejects.toThrowError('TimestampFilter.isInvalid ')
})

it('should error on Zero', async () => {
  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(1),
        currency: 'USD',
        timestamp: new BigNumber('0.0')
      }
    ])
  }).rejects.toThrowError('TimestampFilter.isInvalid ')
})

it('should error on older than 3 weeks', async () => {
  const timestamp = new BigNumber(Date.now()).minus((1000 * 60 * 60 * 24 * 7 * 3) + 1000)

  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(1),
        currency: 'USD',
        timestamp: timestamp
      }
    ])
  }).rejects.toThrowError('TimestampFilter.isInvalid ')
})

it('should error on more than 3 weeks into the future', async () => {
  const timestamp = new BigNumber(Date.now()).plus((1000 * 60 * 60 * 24 * 7 * 3) + 1)

  await expect(async () => {
    await filter.call([
      {
        token: 'TSLA',
        amount: new BigNumber(1),
        currency: 'USD',
        timestamp: timestamp
      }
    ])
  }).rejects.toThrowError('TimestampFilter.isInvalid ')
})

it('should allow 5 mins old', async () => {
  const timestamp = new BigNumber(Date.now()).minus(1000 * 60 * 5)

  await filter.call([
    {
      token: 'TSLA',
      amount: new BigNumber(1),
      currency: 'USD',
      timestamp: timestamp
    }
  ])
})

it('should allow 1 week old', async () => {
  const timestamp = new BigNumber(Date.now()).minus(1000 * 60 * 60 * 24 * 7)

  await filter.call([
    {
      token: 'TSLA',
      amount: new BigNumber(1),
      currency: 'USD',
      timestamp: timestamp
    }
  ])
})

it('should allow 2 weeks old', async () => {
  const timestamp = new BigNumber(Date.now()).minus(1000 * 60 * 60 * 24 * 7 * 2)

  await filter.call([
    {
      token: 'TSLA',
      amount: new BigNumber(1),
      currency: 'USD',
      timestamp: timestamp
    }
  ])
})

it('should allow 3 weeks old', async () => {
  const timestamp = new BigNumber(Date.now()).minus(1000 * 60 * 60 * 24 * 7 * 3)

  await filter.call([
    {
      token: 'TSLA',
      amount: new BigNumber(1),
      currency: 'USD',
      timestamp: timestamp
    }
  ])
})

it('should allow 5 mins into the future', async () => {
  const timestamp = new BigNumber(Date.now()).plus(1000 * 60 * 5)

  await filter.call([
    {
      token: 'TSLA',
      amount: new BigNumber(1),
      currency: 'USD',
      timestamp: timestamp
    }
  ])
})

it('should allow 1 week into the future', async () => {
  const timestamp = new BigNumber(Date.now()).plus(1000 * 60 * 60 * 24 * 7)

  await filter.call([
    {
      token: 'TSLA',
      amount: new BigNumber(1),
      currency: 'USD',
      timestamp: timestamp
    }
  ])
})

it('should allow 2 weeks into the future', async () => {
  const timestamp = new BigNumber(Date.now()).plus(1000 * 60 * 60 * 24 * 7 * 2)

  await filter.call([
    {
      token: 'TSLA',
      amount: new BigNumber(1),
      currency: 'USD',
      timestamp: timestamp
    }
  ])
})

it('should allow 3 weeks into the future', async () => {
  const timestamp = new BigNumber(Date.now()).plus(1000 * 60 * 60 * 24 * 7 * 3)

  await filter.call([
    {
      token: 'TSLA',
      amount: new BigNumber(1),
      currency: 'USD',
      timestamp: timestamp
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
        timestamp: new BigNumber(Date.now())
      },
      {
        token: 'TSLA',
        amount: new BigNumber(1),
        currency: 'USD',
        timestamp: new BigNumber(-1)
      }
    ])
  }).rejects.toThrowError('TimestampFilter.isInvalid ')
})
