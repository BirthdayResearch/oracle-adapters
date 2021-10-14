import BigNumber from 'bignumber.js'
import { newAssetPrice } from '@defichain/salmon-fetch'

describe('AssetPrice.amount', () => {
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

  it('should exclude invalid price - array', () => {
    expect(() => {
      newAssetPrice('APPL', [] as any, 'USD', 0)
    }).toThrowError(Error('price is not string, number of BigNumber'))
  })

  it('should exclude invalid price - JSON', () => {
    expect(() => {
      newAssetPrice('APPL', JSON.parse('{}'), 'USD', 0)
    }).toThrowError(Error('price is not string, number of BigNumber'))
  })

  it('should exclude invalid price - Date', () => {
    expect(() => {
      newAssetPrice('APPL', new Date() as any, 'USD', 0)
    }).toThrowError(Error('price is not string, number of BigNumber'))
  })

  it('should exclude invalid price - null', () => {
    expect(() => {
      newAssetPrice('APPL', null as any, 'USD', 0)
    }).toThrowError(Error('price is not string, number of BigNumber'))
  })
})

describe('AssetPrice.token', () => {
  it('should exclude invalid token - not string', () => {
    const json = JSON.parse('{"test": 12}')

    expect(() => {
      newAssetPrice(json.test, '$1.00', 'USD', 0)
    }).toThrowError(Error('token is not string'))
  })

  it('should exclude invalid token - array', () => {
    expect(() => {
      newAssetPrice([] as any, '1', 'USD', 0)
    }).toThrowError(Error('token is not string'))
  })

  it('should exclude invalid token - null', () => {
    expect(() => {
      newAssetPrice(null as any, '1', 'USD', 0)
    }).toThrowError(Error('token is not string'))
  })

  it('should exclude invalid token - number', () => {
    expect(() => {
      newAssetPrice(123 as any, '1', 'USD', 0)
    }).toThrowError(Error('token is not string'))
  })

  it('should exclude invalid token - BigNumber', () => {
    expect(() => {
      newAssetPrice(new BigNumber(123) as any, '1', 'USD', 0)
    }).toThrowError(Error('token is not string'))
  })
})

describe('AssetPrice.currency', () => {
  it('should exclude invalid currency - JSON', () => {
    const json = JSON.parse('{"test": 12}')

    expect(() => {
      newAssetPrice('APPL', '1', json.test, 0)
    }).toThrowError(Error('currency is not string'))
  })

  it('should exclude invalid currency - array', () => {
    expect(() => {
      newAssetPrice('APPL', '1', [] as any, 0)
    }).toThrowError(Error('currency is not string'))
  })

  it('should exclude invalid currency - null', () => {
    expect(() => {
      newAssetPrice('APPL', '1', null as any, 0)
    }).toThrowError(Error('currency is not string'))
  })

  it('should exclude invalid currency - number', () => {
    expect(() => {
      newAssetPrice('APPL', '1', 123 as any, 0)
    }).toThrowError(Error('currency is not string'))
  })

  it('should exclude invalid currency - BigNumber', () => {
    expect(() => {
      newAssetPrice('APPL', '1', new BigNumber(123) as any, 0)
    }).toThrowError(Error('currency is not string'))
  })
})

describe('AssetPrice.timestamp', () => {
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

  it('should exclude invalid timestamp - string', () => {
    expect(() => {
      newAssetPrice('APPL', '1', 'USD', 'string' as any)
    }).toThrowError(Error('timestamp is not number or BigNumber'))
  })

  it('should exclude invalid timestamp - array', () => {
    expect(() => {
      newAssetPrice('APPL', '1', 'USD', [] as any)
    }).toThrowError(Error('timestamp is not number or BigNumber'))
  })

  it('should exclude invalid timestamp - JSON', () => {
    expect(() => {
      newAssetPrice('APPL', '1', 'USD', JSON.parse('{}'))
    }).toThrowError(Error('timestamp is not number or BigNumber'))
  })

  it('should exclude invalid timestamp - Date', () => {
    expect(() => {
      newAssetPrice('APPL', '1', 'USD', new Date() as any)
    }).toThrowError(Error('timestamp is not number or BigNumber'))
  })

  it('should exclude invalid timestamp - null', () => {
    expect(() => {
      newAssetPrice('APPL', '1', 'USD', null as any)
    }).toThrowError(Error('timestamp is not number or BigNumber'))
  })
})
