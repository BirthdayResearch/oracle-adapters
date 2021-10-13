import BigNumber from 'bignumber.js'
import { newAssetPrice } from '@defichain/salmon-fetch'

describe('PriceAsset interface', () => {
  it('should include valid price - string', () => {
    expect(newAssetPrice('APPL', '1', 'USD', 0)).toStrictEqual({
      amount: new BigNumber('1'),
      currency: 'USD',
      token: 'APPL',
      timestamp: new BigNumber(0)
    })
  })

  it('should include valid price - number', () => {
    expect(newAssetPrice('APPL', 1, 'USD', 0)).toStrictEqual({
      amount: new BigNumber(1),
      currency: 'USD',
      token: 'APPL',
      timestamp: new BigNumber(0)
    })
  })

  it('should include valid price - BigNumber', () => {
    expect(newAssetPrice('APPL', new BigNumber('1'), 'USD', 0)).toStrictEqual({
      amount: new BigNumber('1'),
      currency: 'USD',
      token: 'APPL',
      timestamp: new BigNumber(0)
    })
  })

  it('should exclude invalid price - string', () => {
    expect(() => {
      newAssetPrice('APPL', '$1.00', 'USD', 0)
    }).toThrowError(Error('price is not string, number of BigNumber'))
  })

  it('should exclude invalid price - NaN', () => {
    expect(() => {
      newAssetPrice('APPL', new BigNumber(NaN), 'USD', 0)
    }).toThrowError(Error('price is not string, number of BigNumber'))
  })

  it('should exclude invalid price - Infinity', () => {
    expect(() => {
      newAssetPrice('APPL', new BigNumber(Infinity), 'USD', 0)
    }).toThrowError(Error('price is not string, number of BigNumber'))
  })

  it('should include valid timestamp - number', () => {
    const timestamp = Date.now()
    expect(newAssetPrice('APPL', 1, 'USD', timestamp)).toStrictEqual({
      amount: new BigNumber(1),
      currency: 'USD',
      token: 'APPL',
      timestamp: new BigNumber(timestamp)
    })
  })

  it('should include valid timestamp - BigNumber', () => {
    const timestamp = Date.now()
    expect(newAssetPrice('APPL', 1, 'USD', new BigNumber(timestamp))).toStrictEqual({
      amount: new BigNumber(1),
      currency: 'USD',
      token: 'APPL',
      timestamp: new BigNumber(timestamp)
    })
  })

  it('should exclude invalid timestamp - NaN', () => {
    expect(() => {
      newAssetPrice('APPL', '1', 'USD', new BigNumber(NaN))
    }).toThrowError(Error('timestamp is not number or BigNumber'))
  })

  it('should exclude invalid timestamp - Infinity', () => {
    expect(() => {
      newAssetPrice('APPL', '1', 'USD', new BigNumber(Infinity))
    }).toThrowError(Error('timestamp is not number or BigNumber'))
  })
})
