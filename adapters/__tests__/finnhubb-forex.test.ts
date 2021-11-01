
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
    expect(prices).toStrictEqual([
      {
        token: 'XAU',
        amount: new BigNumber('1802.532'),
        currency: 'USD',
        timestamp: new BigNumber('1625805900000')
      },
      {
        token: 'EUR',
        amount: new BigNumber('1.35424'),
        currency: 'USD',
        timestamp: new BigNumber('1625805900000')
      },
      {
        token: 'SGD',
        amount: new BigNumber('0.72596335336992188634'),
        currency: 'USD',
        timestamp: new BigNumber('1625805900000')
      }
    ])
  })

  it('should not fetch price as empty price', async () => {
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

    const promise = finnhubbForex(symbols, 'API_TOKEN')
    await expect(promise).rejects.toThrow('price is not string, number of BigNumber')
  })

  it('should not fetch price as null price', async () => {
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

    const promise = finnhubbForex(symbols, 'API_TOKEN')
    await expect(promise).rejects.toThrow('price is not string, number of BigNumber')
  })
})
