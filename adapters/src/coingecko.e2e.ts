import BigNumber from 'bignumber.js'
import coingecko from './coingecko'

describe('multi price fetch', () => {
  it('should fetch price from coingecko', async () => {
    const symbols = ['BTC', 'DFI', 'ETH', 'DOGE', 'BCH', 'LTC', 'USDT', 'USDC']
    const coingeckoPrices = await coingecko(symbols)
    expect(coingeckoPrices).toStrictEqual([
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'BTC'
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'DFI'
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'ETH'
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'DOGE'
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'BCH'
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'LTC'
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'USDT'
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'USDC'
      }
    ])

    for (const assetPrice of coingeckoPrices) {
      expect(assetPrice.amount).not.toStrictEqual(new BigNumber(0))
    }
  })
})
