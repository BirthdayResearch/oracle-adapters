import nock from 'nock'
import polygon from '../src/polygon'
import BigNumber from 'bignumber.js'

afterEach(() => {
  jest.clearAllMocks()
  nock.cleanAll()
})

it('should fetch price from polygon', async () => {
  nock('https://api.polygon.io/v2/last/trade/AAPL')
    .get('?apikey=API_TOKEN')
    .reply(200, function (_) {
      return `{
        "request_id": "f05562305bd26ced64b98ed68b3c5d96",
        "results": {
          "T": "AAPL",
          "c": [
            37
          ],
          "f": 1617901342969796400,
          "i": "118749",
          "p": 129.8473,
          "q": 3135876,
          "r": 202,
          "s": 25,
          "t": 1617901342969834000,
          "x": 4,
          "y": 1617901342968000000,
          "z": 3
        },
        "status": "OK"
       }`
    })

  const prices = await polygon(['AAPL'], 'API_TOKEN')
  expect(prices).toStrictEqual([
    {
      token: 'AAPL',
      amount: new BigNumber('129.8473'),
      currency: 'USD',
      timestamp: new BigNumber('1617901342969')
    }
  ])
})

it('should fetch multiple prices from polygon', async () => {
  nock('https://api.polygon.io/v2/last/trade/TSLA')
    .get('?apikey=API_TOKEN')
    .reply(200, function (_) {
      return `{
        "request_id": "f05562305bd26ced64b98ed68b3c5d96",
        "results": {
          "T": "AAPL",
          "c": [
            37
          ],
          "f": 1617901342969796400,
          "i": "118749",
          "p": 129.8473,
          "q": 3135876,
          "r": 202,
          "s": 25,
          "t": 1617901342969834000,
          "x": 4,
          "y": 1617901342968000000,
          "z": 3
        },
        "status": "OK"
       }`
    })
  nock('https://api.polygon.io/v2/last/trade/AAPL')
    .get('?apikey=API_TOKEN')
    .reply(200, function (_) {
      return `{
        "request_id": "f05562305bd26ced64b98ed68b3c5d96",
        "results": {
          "T": "AAPL",
          "c": [
            37
          ],
          "f": 1617901342969796400,
          "i": "118749",
          "p": 129.8473,
          "q": 3135876,
          "r": 202,
          "s": 25,
          "t": 1617901342969834000,
          "x": 4,
          "y": 1617901342968000000,
          "z": 3
        },
        "status": "OK"
       }`
    })
  nock('https://api.polygon.io/v2/last/trade/FB')
    .get('?apikey=API_TOKEN')
    .reply(200, function (_) {
      return `{
        "request_id": "f05562305bd26ced64b98ed68b3c5d96",
        "results": {
          "T": "AAPL",
          "c": [
            37
          ],
          "f": 1617901342969796400,
          "i": "118749",
          "p": 129.8473,
          "q": 3135876,
          "r": 202,
          "s": 25,
          "t": 1617901342969834000,
          "x": 4,
          "y": 1617901342968000000,
          "z": 3
        },
        "status": "OK"
       }`
    })

  const prices = await polygon(['TSLA', 'AAPL', 'FB'], 'API_TOKEN')
  expect(prices).toStrictEqual([
    {
      token: 'TSLA',
      amount: new BigNumber('129.8473'),
      currency: 'USD',
      timestamp: new BigNumber('1617901342969')
    },
    {
      token: 'AAPL',
      amount: new BigNumber('129.8473'),
      currency: 'USD',
      timestamp: new BigNumber('1617901342969')
    },
    {
      token: 'FB',
      amount: new BigNumber('129.8473'),
      currency: 'USD',
      timestamp: new BigNumber('1617901342969')
    }
  ])
})
