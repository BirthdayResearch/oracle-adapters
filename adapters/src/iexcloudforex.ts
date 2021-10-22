import { AssetPrice, fetchAsJson, newAssetPrice } from '@defichain/salmon-fetch'
import BigNumber from 'bignumber.js'

const URL = 'https://cloud.iexapis.com/stable/fx/latest'
const IEX_SYMBOL_MAPPING: Record<string, {
  ticker: string
  inverse: boolean
}> = {
  CAD: {
    ticker: 'USDCAD',
    inverse: true
  },
  GBP: {
    ticker: 'USDGBP',
    inverse: true
  },
  JPY: {
    ticker: 'USDJPY',
    inverse: true
  },
  SGD: {
    ticker: 'USDSGD',
    inverse: true
  },
  EUR: {
    ticker: 'USDEUR',
    inverse: true
  }
}

export default async function (symbols: string[], apiToken: string): Promise<AssetPrice[]> {
  const tickers = symbols.map(x => IEX_SYMBOL_MAPPING[x].ticker)
  const response = await fetchAsJson(`${URL}?symbols=${tickers.join(',')}&token=${apiToken}`, {
    method: 'GET'
  })

  return response.data.map((x: any) => {
    const asset = symbolFromTicker(x.symbol)

    if (asset === undefined) {
      throw Error('iexcloudforex.invalidSymbol ')
    }

    let price = x.rate
    if (IEX_SYMBOL_MAPPING[asset].inverse) {
      price = (new BigNumber(1)).div(price)
    }

    return newAssetPrice(asset, price, 'USD', x.timestamp)
  })
}

function symbolFromTicker (ticker: string): string | undefined {
  return Object.keys(IEX_SYMBOL_MAPPING).find(x =>
    IEX_SYMBOL_MAPPING[x].ticker === ticker
  )
}
