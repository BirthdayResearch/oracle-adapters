
import nock from 'nock'
import finnhubbForex from '../src/finnhubb-forex'
import BigNumber from 'bignumber.js'

describe('multi price fetch', () => {
  afterEach(() => {
    jest.clearAllMocks()
    nock.cleanAll()
  })

  it('should fetch price from finnhubb using config', async () => {
    nock('https://finnhub.io/')
      .filteringPath(() => {
        return '/'
      })
      .get('/')
      .reply(200, (_) => {
        return `{
          "c": [
            1802.56,
            1802.532
          ],
          "h": [
            1802.97,
            1802.94
          ],
          "l": [
            1802.367,
            1802.215
          ],
          "o": [
            1802.97,
            1802.51
          ],
          "s": "ok",
          "t": [
            1625805600,
            1625805900
          ],
          "v": [
            36,
            103
          ]
        }`
      })

    nock('https://finnhub.io/')
      .filteringPath(() => {
        return '/'
      })
      .get('/')
      .reply(200, (_) => {
        return `{
          "c": [
            1.3542,
            1.35424
          ],
          "h": [
            1.35424,
            1.35433
          ],
          "l": [
            1.35414,
            1.35416
          ],
          "o": [
            1.35417,
            1.3542
          ],
          "s": "ok",
          "t": [
            1625805600,
            1625805900
          ],
          "v": [
            85,
            90
          ]
        }`
      })

    nock('https://finnhub.io/')
      .filteringPath(() => {
        return '/'
      })
      .get('/')
      .reply(200, (_) => {
        return `{
          "c": [
            1.37725,
            1.37748
          ],
          "h": [
            1.37739,
            1.37748
          ],
          "l": [
            1.37725,
            1.37714
          ],
          "o": [
            1.37733,
            1.37727
          ],
          "s": "ok",
          "t": [
            1625805600,
            1625805900
          ],
          "v": [
            55,
            84
          ]
        }`
      })

    const symbols = ['XAU', 'EUR', 'SGD']

    const prices = await finnhubbForex(symbols, 'API_TOKEN')
    expect(prices[0].token).toStrictEqual('XAU')
    expect(prices[0].amount).toStrictEqual(new BigNumber(1802.532))
    expect(prices[1].token).toStrictEqual('EUR')
    expect(prices[1].amount).toStrictEqual(new BigNumber(1.35424))
    expect(prices[2].token).toStrictEqual('SGD')
    expect(prices[2].amount).toStrictEqual(new BigNumber(1).div(new BigNumber(1.37748)))
  })

  it('should handle empty price', async () => {
    nock('https://finnhub.io/')
      .filteringPath(() => {
        return '/'
      })
      .get('/')
      .reply(200, (_) => {
        return `{
          "c": [
          ],
          "h": [
          ],
          "l": [
          ],
          "o": [
          ],
          "s": "ok",
          "t": [
          ],
          "v": [
          ]
        }`
      })

    const symbols = ['SGD']

    const prices = await finnhubbForex(symbols, 'API_TOKEN')
    expect(prices.length).toStrictEqual(0)
  })

  it('should handle null price', async () => {
    nock('https://finnhub.io/')
      .filteringPath(() => {
        return '/'
      })
      .get('/')
      .reply(200, (_) => {
        return `{
          "c": null,
          "h": null,
          "l": null,
          "o": null,
          "s": "ok",
          "t": null,
          "v": null
        }`
      })

    const symbols = ['SGD']

    const prices = await finnhubbForex(symbols, 'API_TOKEN')
    expect(prices.length).toStrictEqual(0)
  })
})
