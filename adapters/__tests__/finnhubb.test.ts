import nock from 'nock'
import finnhubb from '../src/finnhubb'
import BigNumber from 'bignumber.js'

afterEach(() => {
  jest.clearAllMocks()
  nock.cleanAll()
})

it('should fetch price from finnhubb', async () => {
  nock('https://finnhub.io/api/v1/quote')
    .get('?symbol=AAPL&token=API_TOKEN')
    .reply(200, function (_) {
      return `{
          "c": 261.74,
          "h": 263.31,
          "l": 260.68,
          "o": 261.07,
          "pc": 259.45,
          "t": 1582641000 
        }`
    })

  const prices = await finnhubb(['AAPL'], 'API_TOKEN')
  expect(prices).toStrictEqual([
    {
      token: 'AAPL',
      amount: new BigNumber(261.74),
      currency: 'USD',
      timestamp: new BigNumber(1582641000000)
    }
  ])
})

it('should fetch multiple prices from finnhubb', async () => {
  nock('https://finnhub.io/api/v1/quote')
    .get('?symbol=TSLA&token=API_TOKEN')
    .reply(200, function (_) {
      return `{
          "c": 605.14,
          "h": 263.31,
          "l": 260.68,
          "o": 261.07,
          "pc": 259.45,
          "t": 1582641000 
        }`
    })

  nock('https://finnhub.io/api/v1/quote')
    .get('?symbol=AAPL&token=API_TOKEN')
    .reply(200, function (_) {
      return `{
          "c": 126,
          "h": 263.31,
          "l": 260.68,
          "o": 261.07,
          "pc": 259.45,
          "t": 1582641000 
        }`
    })

  nock('https://finnhub.io/api/v1/quote')
    .get('?symbol=FB&token=API_TOKEN')
    .reply(200, function (_) {
      return `{
          "c": 336.59,
          "h": 263.31,
          "l": 260.68,
          "o": 261.07,
          "pc": 259.45,
          "t": 1582641000 
        }`
    })

  const prices = await finnhubb(['TSLA', 'AAPL', 'FB'], 'API_TOKEN')
  expect(prices).toStrictEqual([
    {
      token: 'TSLA',
      amount: new BigNumber(605.14),
      currency: 'USD',
      timestamp: new BigNumber(1582641000000)
    },
    {
      token: 'AAPL',
      amount: new BigNumber(126),
      currency: 'USD',
      timestamp: new BigNumber(1582641000000)
    },
    {
      token: 'FB',
      amount: new BigNumber(336.59),
      currency: 'USD',
      timestamp: new BigNumber(1582641000000)
    }
  ])
})

it('should throw error if there are missing symbols', async () => {
  nock('https://finnhub.io/api/v1/quote')
    .get('?symbol=AAPL&token=API_TOKEN')
    .reply(200, function (_) {
      return `{
          "c": 261.74,
          "h": 263.31,
          "l": 260.68,
          "o": 261.07,
          "pc": 259.45,
          "t": 1582641000 
        }`
    })
  nock('https://finnhub.io/api/v1/quote')
    .get('?symbol=AMZN&token=API_TOKEN')
    .reply(200, function (_) {
      return '{}'
    })

  await expect(async () => {
    await finnhubb(['AAPL', 'AMZN'], 'API_TOKEN')
  }).rejects.toThrow()
})
