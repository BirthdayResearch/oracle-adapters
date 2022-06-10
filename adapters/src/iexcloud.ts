import { AssetPrice, fetchAsJson, newAssetPrice, FetchResponse } from '@defichain/salmon-fetch'

const URL = 'https://cloud.iexapis.com/stable/stock'

function fetchPath (symbol: string, apiToken: string): string {
  return `${URL}/${symbol}/quote?token=${apiToken}`
}

export default async function (symbols: string[], apiToken: string): Promise<AssetPrice[]> {
  // META to FB Remap
  symbols = symbols.map(symbol => {
    if (symbol.toLowerCase() === 'FB'.toLowerCase()) {
      return 'META'
    }
    return symbol
  })
  // END META to FB Remap

  const responses = await Promise.all(symbols.map(
    async (symbol: string) => await fetchAsJson(fetchPath(symbol, apiToken), { method: 'GET' })
  ))

  const stockPrices = responses
    .flatMap((res: FetchResponse) => res.data)
    .map((x: any): AssetPrice => {
      const {
        symbol,
        latestPrice,
        latestUpdate
      } = x

      // META to FB Remap
      if (symbol.toLowerCase() === 'META'.toLowerCase()) {
        return newAssetPrice('FB', latestPrice, 'USD', latestUpdate)
      }
      // END META to FB Remap

      return newAssetPrice(symbol, latestPrice, 'USD', latestUpdate)
    })

  if (stockPrices.length !== symbols.length) {
    throw new Error('iexcloud.invalidNumberOfSymbols')
  }

  // TODO(joeldavidw): Remove META bypass condition
  const matchingRequestedSymbols = stockPrices.filter((stock) => !symbols.includes(stock.token) && stock.token === 'META').length === 0
  if (!matchingRequestedSymbols) {
    throw new Error('iexcloud.invalidSymbols')
  }

  return stockPrices
}
