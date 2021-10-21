import { WhaleMasternodeRegTestContainer } from '@defichain/salmon-testing'
import { AbstractFilter } from '../src/AbstractFilter'
import BigNumber from 'bignumber.js'
import { TimestampFilter } from '../src/filters/TimestampFilter'

const container = new WhaleMasternodeRegTestContainer()
let filter: AbstractFilter

describe('default TimestampFilter', () => {
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
    const timestamp = new BigNumber(Date.now()).minus(1000 * 60 * 60 * 24 * 7 * 3)

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
    const timestamp = new BigNumber(Date.now()).plus(1000 * 60 * 60 * 24 * 7 * 3)

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

  it('should allow 3 weeks old - minus 1 min', async () => {
    const timestamp = new BigNumber(Date.now()).minus(1000 * 60 * 60 * 24 * 7 * 3).plus(1000 * 60)

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

  it('should allow 59 mins into the future', async () => {
    const timestamp = new BigNumber(Date.now()).plus(1000 * 60 * 59)

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
})

describe('TimestampFilter with custom options (maxAge: 2 week, minAge: 30 mins)', () => {
  beforeAll(async () => {
    await container.start()

    const network = 'regtest'
    const client = container.getWhaleApiClient()
    const oracleId = '0000000000000000000000000000000000000000000000000000000000000000'

    const maxAge = new BigNumber(1000 * 60 * 60 * 24 * 7 * 2)
    const minAge = new BigNumber(1000 * 60 * 30).negated()

    filter = new TimestampFilter(network, client, oracleId, {
      maxAge: maxAge,
      minAge: minAge
    })
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

  it('should error on older than 2 weeks', async () => {
    const timestamp = new BigNumber(Date.now()).minus((1000 * 60 * 60 * 24 * 7 * 2) + 1)

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

  it('should error on older than 3 weeks', async () => {
    const timestamp = new BigNumber(Date.now()).minus(1000 * 60 * 60 * 24 * 7 * 3)

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

  it('should error on 35 mins into the future', async () => {
    const timestamp = new BigNumber(Date.now()).plus(1000 * 60 * 35)

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

  it('should error on 2 weeks into the future', async () => {
    const timestamp = new BigNumber(Date.now()).plus(1000 * 60 * 60 * 24 * 7 * 2)

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

  it('should error on 3 weeks into the future', async () => {
    const timestamp = new BigNumber(Date.now()).plus(1000 * 60 * 60 * 24 * 7 * 3)

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

  it('should allow 2 weeks old minus 1 min', async () => {
    const timestamp = new BigNumber(Date.now()).minus(1000 * 60 * 60 * 24 * 7 * 2).plus(1000 * 60)

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

  it('should allow 29 mins into the future', async () => {
    const timestamp = new BigNumber(Date.now()).plus(1000 * 60 * 29)

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
})
