import { fetchAsJson } from '../src'
import nock from 'nock'
import { BigNumber } from '@defichain/jellyfish-json'

describe('single asset price fetch', () => {
  afterEach(() => {
    jest.clearAllMocks()
    nock.cleanAll()
  })

  describe('FetchAsJson', () => {
    it('should convert all number to BigNumber', async () => {
      nock('https://test.defichain.endpoint')
        .get('/')
        .reply(200, function (_) {
          return {
            dfi: {
              usd: 0.208377
            },
            doge: 123,
            currency: 'USD'
          }
        })
      const price = await fetchAsJson('https://test.defichain.endpoint/')
      expect(price.data.dfi.usd).toStrictEqual(new BigNumber(0.208377))
      expect(price.data.doge).toStrictEqual(new BigNumber(123))
      expect(price.data.currency).toStrictEqual('USD')
    })

    it('should timeout after 1 second', async () => {
      nock('https://test.defichain.endpoint')
        .get('/')
        .delay(2000)
        .reply(200, function (_) {
          return 'Aborted'
        })

      const promise = fetchAsJson('https://test.defichain.endpoint/', {
        timeout: 1000
      })
      await expect(promise).rejects.toThrow('The user aborted a request.')
    })
  })
})
