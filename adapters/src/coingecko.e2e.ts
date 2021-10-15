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
        token: 'BTC',
        timestamp: expect.any(BigNumber)
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'DFI',
        timestamp: expect.any(BigNumber)
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'ETH',
        timestamp: expect.any(BigNumber)
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'DOGE',
        timestamp: expect.any(BigNumber)
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'BCH',
        timestamp: expect.any(BigNumber)
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'LTC',
        timestamp: expect.any(BigNumber)
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'USDT',
        timestamp: expect.any(BigNumber)
      },
      {
        amount: expect.any(BigNumber),
        currency: 'USD',
        token: 'USDC',
        timestamp: expect.any(BigNumber)
      }
    ])

    for (const assetPrice of coingeckoPrices) {
      expect(assetPrice.amount.toNumber()).toBeGreaterThan(0)
    }
  })
})
