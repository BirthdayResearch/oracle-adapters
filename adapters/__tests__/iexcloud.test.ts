import nock from 'nock'
import iexcloud from '../src/iexcloud'
import BigNumber from 'bignumber.js'

afterEach(() => {
  jest.clearAllMocks()
  nock.cleanAll()
})

it('should fetch price from iexcloud', async () => {
  nock('https://cloud.iexapis.com')
    .get('/stable/stock/AMZN/quote?token=API_TOKEN')
    .reply(200, function (_) {
      return `[
          {
            "symbol": "AMZN",
            "latestPrice": 121.41,
            "size": 1,
            "latestUpdate": 1480446908666
          }
        ]`
    })

  const prices = await iexcloud(['AMZN'], 'API_TOKEN')
  expect(prices).toStrictEqual([
    {
      token: 'AMZN',
      currency: 'USD',
      amount: new BigNumber(121.41),
      timestamp: new BigNumber(1480446908666)
    }
  ])
})

it('should fetch multiple prices from iexcloud', async () => {
  nock('https://cloud.iexapis.com')
    .get('/stable/stock/AMZN/quote?token=API_TOKEN')
    .reply(200, function (_) {
      return `[
          {
            "symbol": "AMZN",
            "latestPrice": 121.41,
            "size": 1,
            "latestUpdate": 1480446908666
          }
        ]`
    })

  nock('https://cloud.iexapis.com')
    .get('/stable/stock/IBM/quote?token=API_TOKEN')
    .reply(200, function (_) {
      return `[
          {
            "symbol": "IBM",
            "latestPrice": 128.89,
            "size": 1,
            "latestUpdate": 1649188799102
          }
        ]`
    })

  nock('https://cloud.iexapis.com')
    .get('/stable/stock/SNAP/quote?token=API_TOKEN')
    .reply(200, function (_) {
      return `[
          {
            "symbol": "SNAP",
            "latestPrice": 38.26,
            "size": 1,
            "latestUpdate": 1649188799978
          }
        ]`
    })

  const prices = await iexcloud(['AMZN', 'IBM', 'SNAP'], 'API_TOKEN')

  expect(prices).toStrictEqual([
    {
      token: 'AMZN',
      amount: new BigNumber(121.41),
      currency: 'USD',
      timestamp: new BigNumber(1480446908666)
    },
    {
      token: 'IBM',
      amount: new BigNumber(128.89),
      currency: 'USD',
      timestamp: new BigNumber(1649188799102)
    },
    {
      token: 'SNAP',
      amount: new BigNumber(38.26),
      currency: 'USD',
      timestamp: new BigNumber(1649188799978)
    }
  ])
})
