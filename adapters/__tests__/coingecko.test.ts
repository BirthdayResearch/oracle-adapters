import nock from 'nock'
import coingecko from '../src/coingecko'
import BigNumber from 'bignumber.js'

describe('multi price fetch with mocks', () => {
  afterEach(() => {
    jest.clearAllMocks()
    nock.cleanAll()
  })

  it('should fetch price from coingecko', async () => {
    nock('https://api.coingecko.com')
      .get('/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=usd')
      .reply(200, function (_) {
        return `{
          "dogecoin":{
             "usd":0.208377
          },
          "ethereum":{
             "usd":2299.23
          },
          "bitcoin":{
             "usd":39877
          }
        }`
      })

    const prices = await coingecko(['BTC', 'ETH', 'DOGE'])
    expect(prices[0].token).toStrictEqual('BTC')
    expect(prices[0].amount).toStrictEqual(new BigNumber('39877'))
    expect(prices[1].token).toStrictEqual('ETH')
    expect(prices[1].amount).toStrictEqual(new BigNumber('2299.23'))
    expect(prices[2].token).toStrictEqual('DOGE')
    expect(prices[2].amount).toStrictEqual(new BigNumber('0.208377'))
  })
})

describe('live multi price fetch', () => {
  it('should fetch price from coingecko', async () => {
    const symbols = ['BTC', 'DFI', 'ETH', 'DOGE', 'BCH', 'LTC', 'USDT', 'USDC']
    const coingeckoPrices = await coingecko(symbols)
    expect(coingeckoPrices).toStrictEqual([
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'BTC',
        timestamp: expect.any(BigNumber)
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'DFI',
        timestamp: expect.any(BigNumber)
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'ETH',
        timestamp: expect.any(BigNumber)
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'DOGE',
        timestamp: expect.any(BigNumber)
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'BCH',
        timestamp: expect.any(BigNumber)
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'LTC',
        timestamp: expect.any(BigNumber)
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'USDT',
        timestamp: expect.any(BigNumber)
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'USDC',
        timestamp: expect.any(BigNumber)
      }
    ])

    for (const assetPrice of coingeckoPrices) {
      expect(assetPrice.amount.toNumber()).toBeGreaterThan(0)
    }
  })
})
