import nock from 'nock'
import iexcloud from '../src/iexcloud'
import BigNumber from 'bignumber.js'

afterEach(() => {
  jest.clearAllMocks()
  nock.cleanAll()
})

it('should fetch price from iexcloud', async () => {
  nock('https://cloud.iexapis.com')
    .get('/stable/tops/last?symbols=FB&token=API_TOKEN')
    .reply(200, function (_) {
      return `[
          {
            "symbol": "FB",
            "price": 121.41,
            "size": 1,
            "time": 1480446908666
          }
        ]`
    })

  const prices = await iexcloud(['FB'], 'API_TOKEN')
  expect(prices).toStrictEqual([
    {
      token: 'FB',
      currency: 'USD',
      amount: new BigNumber(121.41),
      timestamp: new BigNumber(1480446908666)
    }
  ])
})

it('should fetch multiple prices from iexcloud', async () => {
  nock('https://cloud.iexapis.com')
    .get('/stable/tops/last?symbols=FB,IBM,SNAP&token=API_TOKEN')
    .reply(200, function (_) {
      return `[
          {
            "symbol": "FB",
            "price": 121.41,
            "size": 1,
            "time": 1480446908666
          },
          {
            "symbol": "IBM",
            "price": 128.89,
            "size": 1,
            "time": 1649188799102
          },
          {
            "symbol": "SNAP",
            "price": 38.26,
            "size": 100,
            "time": 1649188799978
          }
        ]`
    })

  const prices = await iexcloud(['FB', 'IBM', 'SNAP'], 'API_TOKEN')

  expect(prices).toStrictEqual([
    {
      token: 'FB',
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
