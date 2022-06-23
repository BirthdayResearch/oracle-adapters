import nock from 'nock'
import BigNumber from 'bignumber.js'
import nasdaq from '../src/nasdaq'

afterEach(() => {
  jest.clearAllMocks()
  nock.cleanAll()
})

it('should fetch price from nasdaq', async () => {
  nock('https://restapi.clouddataservice.nasdaq.com/v1/auth')
    .post('/token')
    .reply(200, function (_) {
      return `{
          "access_token": "access_token"
        }`
    })

  nock('https://restapi.clouddataservice.nasdaq.com/v1/nasdaq/delayed/equities/lastsale')
    .get('/TSLA')
    .reply(500, function (_) {
      return `[{
          "symbol": "TSLA",
          "timestamp": "2021-08-05T16:00:02.430",
          "price": 714.63,
          "size": 199,
          "conditions": "@6 X",
          "exchange": "Q",
          "securityClass": "Q",
          "changeIndicator": 0
        }]`
    })

  nock('https://restapi.clouddataservice.nasdaq.com/v1/nasdaq/delayed/equities/lastsale')
    .get('/AAPL')
    .reply(200, function (_) {
      return `[{
          "symbol": "AAPL",
          "timestamp": "2021-08-05T16:00:02.286",
          "price": 147.06,
          "size": 12,
          "conditions": "@6 X",
          "exchange": "Q",
          "securityClass": "Q",
          "changeIndicator": 0
        }]`
    })

  nock('https://restapi.clouddataservice.nasdaq.com/v1/nasdaq/delayed/equities/lastsale')
    .get('/FB')
    .reply(200, function (_) {
      return `[{
          "symbol": "FB",
          "timestamp": "2021-08-05T16:00:03.279",
          "price": 362.97,
          "size": 114,
          "conditions": "@6 X",
          "exchange": "Q",
          "securityClass": "Q",
          "changeIndicator": 0
        }]`
    })

  const prices = await nasdaq(['TSLA', 'AAPL', 'FB'], 'API_TOKEN')
  expect(prices).toStrictEqual([
    {
      token: 'TSLA',
      amount: new BigNumber(714.63),
      currency: 'USD',
      timestamp: expect.any(BigNumber)
    },
    {
      token: 'AAPL',
      amount: new BigNumber(147.06),
      currency: 'USD',
      timestamp: expect.any(BigNumber)
    },
    {
      token: 'FB',
      amount: new BigNumber(362.97),
      currency: 'USD',
      timestamp: expect.any(BigNumber)
    }
  ])
})

it('should error on invalid api credentials', async () => {
  nock('https://restapi.clouddataservice.nasdaq.com/v1/auth')
    .post('/token')
    .reply(500, function (_) {
      return '{"message": "Internal Server Error"}'
    })

  await expect(async () => {
    await nasdaq(['TSLA', 'AAPL', 'FB'], 'API_TOKEN')
  }).rejects.toThrowError('nasdaq.unableToAuth ')
})

it('should throw error on mismatched symbol', async () => {
  nock('https://restapi.clouddataservice.nasdaq.com/v1/auth')
    .post('/token')
    .reply(200, function (_) {
      return `{
          "access_token": "access_token"
        }`
    })

  nock('https://restapi.clouddataservice.nasdaq.com/v1/nasdaq/delayed/equities/lastsale')
    .get('/TSLA')
    .reply(500, function (_) {
      return `[{
          "symbol": "AMZN",
          "timestamp": "2021-08-05T16:00:02.430",
          "price": 714.63,
          "size": 199,
          "conditions": "@6 X",
          "exchange": "Q",
          "securityClass": "Q",
          "changeIndicator": 0
        }]`
    })

  await expect(async () => {
    await nasdaq(['TSLA'], 'API_TOKEN')
  }).rejects.toThrowError('nasdaq.mismatchedTickerSymbol ')
})
