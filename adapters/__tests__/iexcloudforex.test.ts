import nock from 'nock'
import iexcloudForex from '../src/iexcloudforex'
import BigNumber from 'bignumber.js'

afterEach(() => {
  jest.clearAllMocks()
  nock.cleanAll()
})

it('should fetch price from iexcloud forex', async () => {
  nock('https://cloud.iexapis.com')
    .get('/stable/fx/latest?symbols=USDCAD,USDGBP,USDJPY&token=API_TOKEN')
    .reply(200, function (_) {
      return `[ 
          {
            "symbol": "USDCAD",
            "rate": 1.31,
            "timestamp":  1288282222000
          },
          {
            "symbol": "USDGBP",
            "rate": 0.755,
            "timestamp":  1288282222000
          },
          {
            "symbol": "USDJPY",
            "rate": 100.43,
            "timestamp":  1288282222000
          }
        ]`
    })

  const prices = await iexcloudForex(['CAD', 'GBP', 'JPY'], 'API_TOKEN')

  expect(prices).toStrictEqual([
    {
      token: 'CAD',
      amount: new BigNumber(1).div(new BigNumber(1.31)),
      currency: 'USD',
      timestamp: new BigNumber(1288282222000)
    },
    {
      token: 'GBP',
      amount: new BigNumber(1).div(new BigNumber(0.755)),
      currency: 'USD',
      timestamp: new BigNumber(1288282222000)
    },
    {
      token: 'JPY',
      amount: new BigNumber(1).div(new BigNumber(100.43)),
      currency: 'USD',
      timestamp: new BigNumber(1288282222000)
    }
  ])
})

it('should error on invalid symbol', async () => {
  nock('https://cloud.iexapis.com')
    .get('/stable/fx/latest?symbols=USDCAD,USDGBP,USDJPY&token=API_TOKEN')
    .reply(200, function (_) {
      return `[ 
          {
            "symbol": "USDCAD",
            "rate": 1.31,
            "timestamp":  1288282222000
          },
          {
            "symbol": "USDGBP",
            "rate": 0.755,
            "timestamp":  1288282222000
          },
          {
            "symbol": "USDJP",
            "rate": 100.43,
            "timestamp":  1288282222000
          }
        ]`
    })

  await expect(async () => {
    await iexcloudForex(['CAD', 'GBP', 'JPY'], 'API_TOKEN')
  }).rejects.toThrowError(Error('iexcloudforex.invalidSymbol '))
})
