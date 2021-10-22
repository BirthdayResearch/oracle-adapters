import nock from 'nock'
import chainlink from '../src/chainlink'
import BigNumber from 'bignumber.js'

describe('multi price fetch', () => {
  it('should fetch price from chainlink', async () => {
    const symbols = ['BTC']

    nock('https://mainnet.infura.io/v3')
      .post('/API_TOKEN')
      .reply(200, (_) => {
        return '{"jsonrpc":"2.0","id":42,"result":"0x0000000000000000000000000000000000000000000000000000042f6e63a936"}'
      })

    nock('https://mainnet.infura.io/v3')
      .post('/API_TOKEN')
      .reply(200, (_) => {
        return '{"jsonrpc":"2.0","id":43,"result":"0x0000000000000000000000000000000000000000000000000000000000000008"}'
      })

    nock('https://mainnet.infura.io/v3')
      .post('/API_TOKEN')
      .reply(200, (_) => {
        return '{"jsonrpc":"2.0","id":44,"result":"0x0000000000000000000000000000000000000000000000000000000061406448"}'
      })

    const prices = await chainlink(symbols, 'API_TOKEN')
    expect(prices).toStrictEqual([
      {
        token: 'BTC',
        currency: 'USD',
        amount: new BigNumber(46017.61999158),
        timestamp: new BigNumber(1631609928000)
      }
    ])
  })
})

describe('inverse price fetch', () => {
  afterEach(() => {
    jest.clearAllMocks()
    nock.cleanAll()
  })

  it('should fetch inverse price from chainlink using config', async () => {
    nock('https://mainnet.infura.io/v3')
      .post('/API_TOKEN')
      .reply(200, (_) => {
        return '{"jsonrpc":"2.0","id":42,"result":"0x0000000000000000000000000000000000000000000000000000042f6e63a936"}'
      })

    nock('https://mainnet.infura.io/v3')
      .post('/API_TOKEN')
      .reply(200, (_) => {
        return '{"jsonrpc":"2.0","id":43,"result":"0x0000000000000000000000000000000000000000000000000000000000000008"}'
      })

    nock('https://mainnet.infura.io/v3')
      .post('/API_TOKEN')
      .reply(200, (_) => {
        return '{"jsonrpc":"2.0","id":44,"result":"0x0000000000000000000000000000000000000000000000000000000061406448"}'
      })

    const symbols = ['BTC_TEST_INVERSE']
    const prices = await chainlink(symbols, 'API_TOKEN')
    expect(prices).toStrictEqual([
      {
        token: 'BTC_TEST_INVERSE',
        currency: 'USD',
        amount: (new BigNumber(1.0)).dividedBy(46017.61999158),
        timestamp: new BigNumber(1631609928000)
      }
    ])
  })
})

describe('throw on invalid data', () => {
  afterEach(() => {
    jest.clearAllMocks()
    nock.cleanAll()
  })

  it('should throw on corrupt data', async () => {
    nock('https://mainnet.infura.io/v3')
      .post('/API_TOKEN')
      .reply(200, (_) => {
        return '{}'
      })

    nock('https://mainnet.infura.io/v3')
      .post('/API_TOKEN')
      .reply(200, (_) => {
        return '{}'
      })

    nock('https://mainnet.infura.io/v3')
      .post('/API_TOKEN')
      .reply(200, (_) => {
        return '{}'
      })

    const symbols = ['BTC']
    await expect(chainlink(symbols, 'API_TOKEN')).rejects.toThrow()
  })
})
